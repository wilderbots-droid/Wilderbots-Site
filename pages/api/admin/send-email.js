import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import { sendEmail } from '../../../lib/emailService'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { to, subject, text, html, cc, bcc, from, attachments, relatedTo, relatedId, configId } = req.body

    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({ error: 'To, subject, and text/html are required' })
    }

    const result = await sendEmail({
      to,
      subject,
      text,
      html,
      cc,
      bcc,
      from,
      attachments,
      relatedTo,
      relatedId,
      configId
    })

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      ...result
    })
  } catch (error) {
    console.error('Send email error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    })
  }
}



