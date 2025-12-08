// API route for handling forgot password requests
// This sends password reset emails from support@wilderbots.com

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    // Generate reset token (in production, save this to database with expiration)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
    
    // In production, you would:
    // 1. Save resetToken to database with expiration (1 hour)
    // 2. Send email using your email service (support@wilderbots.com)
    // 3. Use the emailService from lib/emailService.js
    
    // For now, we'll simulate the email sending
    // In production, uncomment and configure:
    /*
    const { sendEmail } = await import('../../../lib/emailService')
    
    await sendEmail({
      to: email,
      subject: 'Reset Your Wilderbots Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password for your Wilderbots account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Reset Password
          </a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetLink}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
          <p style="color: #999; font-size: 12px;">
            This email was sent from support@wilderbots.com
          </p>
        </div>
      `,
      text: `Reset your password: ${resetLink}`,
      from: {
        name: 'Wilderbots Support',
        address: 'support@wilderbots.com'
      }
    })
    */

    // For demo purposes, log the reset link (remove in production)
    console.log('Password reset link:', resetLink)
    console.log('Email would be sent to:', email)
    console.log('From: support@wilderbots.com')

    // Return success (don't reveal if email exists for security)
    return res.status(200).json({ 
      message: 'If an account with that email exists, a password reset link has been sent.',
      // In development, you might want to return the link for testing
      ...(process.env.NODE_ENV === 'development' && { resetLink })
    })
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return res.status(500).json({ error: 'Failed to send reset email. Please try again later.' })
  }
}
