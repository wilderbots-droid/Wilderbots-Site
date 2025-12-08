import nodemailer from 'nodemailer'
import SMTPConfig from '../models/SMTPConfig'
import Email from '../models/Email'
import connectDB from './mongodb'

let transporterCache = null
let cachedConfigId = null

/**
 * Get active SMTP configuration
 */
export async function getSMTPConfig() {
  await connectDB()
  const config = await SMTPConfig.findOne({ isActive: true, isDefault: true }) ||
                 await SMTPConfig.findOne({ isActive: true })
  
  if (!config) {
    throw new Error('No active SMTP configuration found. Please configure SMTP settings in admin panel.')
  }
  
  return config
}

/**
 * Create or get cached transporter
 */
export async function getTransporter(configId = null) {
  await connectDB()
  
  // Use cached transporter if config hasn't changed
  if (transporterCache && cachedConfigId === configId && configId) {
    return transporterCache
  }
  
  const config = configId 
    ? await SMTPConfig.findById(configId)
    : await getSMTPConfig()
  
  if (!config) {
    throw new Error('SMTP configuration not found')
  }
  
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.auth.user,
      pass: config.auth.pass
    }
  })
  
  // Verify connection
  try {
    await transporter.verify()
  } catch (error) {
    throw new Error(`SMTP connection failed: ${error.message}`)
  }
  
  transporterCache = transporter
  cachedConfigId = config._id.toString()
  
  return transporter
}

/**
 * Send email
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
  cc = [],
  bcc = [],
  from = null,
  attachments = [],
  relatedTo = 'other',
  relatedId = null,
  configId = null
}) {
  await connectDB()
  
  try {
    const transporter = await getTransporter(configId)
    const config = configId 
      ? await SMTPConfig.findById(configId)
      : await getSMTPConfig()
    
    const fromAddress = from || {
      name: config.from.name || config.from.address,
      address: config.from.address
    }
    
    // Normalize recipients
    const normalizeRecipients = (recipients) => {
      if (!recipients) return []
      if (typeof recipients === 'string') {
        return [{ address: recipients }]
      }
      if (Array.isArray(recipients)) {
        return recipients.map(r => 
          typeof r === 'string' ? { address: r } : r
        )
      }
      return [{ address: recipients }]
    }
    
    const toArray = normalizeRecipients(to)
    const ccArray = normalizeRecipients(cc)
    const bccArray = normalizeRecipients(bcc)
    
    const mailOptions = {
      from: `${fromAddress.name || fromAddress.address} <${fromAddress.address}>`,
      to: toArray.map(r => r.address).join(', '),
      subject,
      text,
      html,
      attachments: attachments.map(att => ({
        filename: att.filename,
        path: att.path,
        contentType: att.contentType
      }))
    }
    
    if (ccArray.length > 0) {
      mailOptions.cc = ccArray.map(r => r.address).join(', ')
    }
    
    if (bccArray.length > 0) {
      mailOptions.bcc = bccArray.map(r => r.address).join(', ')
    }
    
    // Send email
    const info = await transporter.sendMail(mailOptions)
    
    // Save to database
    const email = await Email.create({
      messageId: info.messageId,
      direction: 'sent',
      from: {
        name: fromAddress.name,
        address: fromAddress.address
      },
      to: toArray,
      cc: ccArray,
      bcc: bccArray,
      subject,
      text,
      html,
      attachments,
      sentAt: new Date(),
      status: 'sent',
      relatedTo,
      relatedId
    })
    
    return {
      success: true,
      messageId: info.messageId,
      email
    }
  } catch (error) {
    console.error('Error sending email:', error)
    
    // Save failed email attempt
    try {
      // Normalize recipients helper function
      const normalizeRecipients = (recipients) => {
        if (!recipients) return []
        if (typeof recipients === 'string') {
          return [{ address: recipients }]
        }
        if (Array.isArray(recipients)) {
          return recipients.map(r => 
            typeof r === 'string' ? { address: r } : r
          )
        }
        return [{ address: recipients }]
      }
      
      await Email.create({
        direction: 'sent',
        from: from || {},
        to: normalizeRecipients(to),
        cc: normalizeRecipients(cc),
        bcc: normalizeRecipients(bcc),
        subject,
        text,
        html,
        attachments,
        status: 'failed',
        error: error.message,
        relatedTo,
        relatedId
      })
    } catch (dbError) {
      console.error('Error saving failed email:', dbError)
    }
    
    throw error
  }
}

/**
 * Test SMTP connection
 */
export async function testSMTPConnection(config) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass
      }
    })
    
    await transporter.verify()
    return { success: true, message: 'SMTP connection successful' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

