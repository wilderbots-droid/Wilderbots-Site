// API route for handling forgot password requests
// This sends password reset emails from support@wilderbots.com

import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
import PasswordReset from '../../../models/PasswordReset'
import { sendEmail } from '../../../lib/emailService'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    await connectDB()

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() })

    // Always return same response for security (don't reveal if email exists)
    if (!user) {
      return res.status(200).json({ 
        message: 'If an account with that email exists, a password reset link has been sent.'
      })
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to database
    await PasswordReset.create({
      userId: user._id,
      token: resetToken,
      expiresAt
    })

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`

    // Send password reset email
    await sendEmail({
      to: email,
      subject: 'Reset Your Wilderbots Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="color: #666;">Hi ${user.name},</p>
          <p style="color: #666;">You requested to reset your password for your Wilderbots account.</p>
          <p style="color: #666;">Click the button below to reset your password:</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetLink}" style="display: inline-block; padding: 12px 32px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666; background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px;">${resetLink}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
          </p>
          <p style="color: #999; font-size: 12px;">
            For security reasons, never share this email with anyone.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            This email was sent from support@wilderbots.com
          </p>
        </div>
      `,
      text: `Your password reset link: ${resetLink}\n\nThis link will expire in 1 hour.`,
      from: {
        name: 'Wilderbots Support',
        address: 'support@wilderbots.com'
      }
    })

    console.log(`Password reset email sent to: ${email}`)

    // Return success
    return res.status(200).json({ 
      message: 'If an account with that email exists, a password reset link has been sent.',
      // In development, return the link for testing
      ...(process.env.NODE_ENV === 'development' && { resetLink, tokenExpiry: expiresAt })
    })
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return res.status(500).json({ error: 'Failed to send reset email. Please try again later.' })
  }
}
