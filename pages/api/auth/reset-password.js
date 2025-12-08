import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
import PasswordReset from '../../../models/PasswordReset'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()

    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Find reset token
    const resetToken = await PasswordReset.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() }
    }).populate('userId')

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }

    const user = resetToken.userId

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user password
    user.password = hashedPassword
    await user.save()

    // Mark token as used
    resetToken.used = true
    await resetToken.save()

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ error: 'Failed to reset password' })
  }
}

