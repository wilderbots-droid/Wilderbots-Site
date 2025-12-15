import Imap from 'imap'
import { simpleParser } from 'mailparser'
import SMTPConfig from '../models/SMTPConfig'
import Email from '../models/Email'
import connectDB from './mongodb'

/**
 * Fetch emails from IMAP server
 */
export async function fetchEmails(configId = null, limit = 50) {
  await connectDB()
  
  const config = configId 
    ? await SMTPConfig.findById(configId)
    : await SMTPConfig.findOne({ isActive: true, isDefault: true }) ||
      await SMTPConfig.findOne({ isActive: true })
  
  if (!config || !config.imap || !config.imap.host) {
    throw new Error('IMAP configuration not found. Please configure IMAP settings in admin panel.')
  }
  
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: config.imap.auth.user,
      password: config.imap.auth.pass,
      host: config.imap.host,
      port: config.imap.port || 993,
      tls: config.imap.secure !== false,
      tlsOptions: { rejectUnauthorized: false }
    })
    
    const emails = []
    
    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          imap.end()
          return reject(err)
        }
        
        // Search for unseen emails or recent emails
        imap.search(['UNSEEN', ['SINCE', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)]], (err, results) => {
          if (err) {
            imap.end()
            return reject(err)
          }
          
          if (!results || results.length === 0) {
            imap.end()
            return resolve([])
          }
          
          // Limit results
          const fetchResults = results.slice(0, limit)
          
          const f = imap.fetch(fetchResults, {
            bodies: '',
            struct: true
          })
          
          f.on('message', (msg, seqno) => {
            const emailData = {
              seqno,
              messageId: null,
              from: null,
              to: [],
              subject: '',
              text: '',
              html: '',
              date: null,
              attachments: []
            }
            
            msg.on('body', (stream, info) => {
              let buffer = ''
              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8')
              })
              
              stream.once('end', () => {
                simpleParser(buffer)
                  .then(parsed => {
                    emailData.messageId = parsed.messageId
                    emailData.from = {
                      name: parsed.from?.text || parsed.from?.value?.[0]?.name || '',
                      address: parsed.from?.value?.[0]?.address || parsed.from?.text || ''
                    }
                    emailData.to = parsed.to?.value?.map(t => ({
                      name: t.name || '',
                      address: t.address
                    })) || []
                    emailData.cc = parsed.cc?.value?.map(c => ({
                      name: c.name || '',
                      address: c.address
                    })) || []
                    emailData.subject = parsed.subject || ''
                    emailData.text = parsed.text || ''
                    emailData.html = parsed.html || ''
                    emailData.date = parsed.date || new Date()
                    emailData.attachments = parsed.attachments?.map(att => ({
                      filename: att.filename,
                      contentType: att.contentType,
                      size: att.size
                    })) || []
                  })
                  .catch(err => {
                    console.error('Error parsing email:', err)
                  })
              })
            })
            
            msg.once('attributes', (attrs) => {
              emailData.uid = attrs.uid
            })
            
            msg.once('end', () => {
              emails.push(emailData)
            })
          })
          
          f.once('error', (err) => {
            imap.end()
            reject(err)
          })
          
          f.once('end', async () => {
            imap.end()
            
            // Save emails to database
            const savedEmails = []
            for (const emailData of emails) {
              try {
                // Check if email already exists
                const existing = await Email.findOne({ messageId: emailData.messageId })
                if (existing) {
                  savedEmails.push(existing)
                  continue
                }
                
                const email = await Email.create({
                  messageId: emailData.messageId,
                  direction: 'received',
                  from: emailData.from,
                  to: emailData.to,
                  cc: emailData.cc || [],
                  subject: emailData.subject,
                  text: emailData.text,
                  html: emailData.html,
                  attachments: emailData.attachments,
                  date: emailData.date,
                  isRead: false
                })
                
                savedEmails.push(email)
              } catch (error) {
                console.error('Error saving email:', error)
              }
            }
            
            resolve(savedEmails)
          })
        })
      })
    })
    
    imap.once('error', (err) => {
      reject(err)
    })
    
    imap.connect()
  })
}

/**
 * Test IMAP connection
 */
export async function testIMAPConnection(config) {
  return new Promise((resolve) => {
    if (!config.imap || !config.imap.host) {
      return resolve({ success: false, message: 'IMAP configuration not provided' })
    }
    
    const imap = new Imap({
      user: config.imap.auth.user,
      password: config.imap.auth.pass,
      host: config.imap.host,
      port: config.imap.port || 993,
      tls: config.imap.secure !== false,
      tlsOptions: { rejectUnauthorized: false }
    })
    
    imap.once('ready', () => {
      imap.end()
      resolve({ success: true, message: 'IMAP connection successful' })
    })
    
    imap.once('error', (err) => {
      resolve({ success: false, message: err.message })
    })
    
    imap.connect()
  })
}



