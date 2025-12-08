import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()

    // Get user from token
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const userId = decoded.userId
    const { name, email, currentPassword, newPassword, address, phone } = req.body

    // Find user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Update name if provided
    if (name) {
      user.name = name
    }

    // Update email if provided
    if (email && email !== user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email: email.toLowerCase() })
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ error: 'Email already in use' })
      }
      user.email = email.toLowerCase()
    }

    // Update address if provided
    if (address) {
      user.address = {
        street: address.street || user.address?.street || '',
        city: address.city || user.address?.city || '',
        state: address.state || user.address?.state || '',
        zipCode: address.zipCode || user.address?.zipCode || '',
        country: address.country || user.address?.country || ''
      }
    }

    // Update phone if provided
    if (phone !== undefined) {
      user.phone = phone || ''
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change password' })
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Current password is incorrect' })
      }

      // Validate new password
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' })
      }

      // Hash new password
      user.password = await bcrypt.hash(newPassword, 10)
    }

    await user.save()

    // Return updated user without password
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      address: user.address || {},
      phone: user.phone || '',
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: userResponse
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Failed to update profile. Please try again.' })
  }
}

