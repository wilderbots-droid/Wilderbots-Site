import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import Admin from '../../../models/Admin'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const adminUser = await Admin.findById(admin.id).select('-password').lean()
      if (!adminUser) {
        return res.status(404).json({ error: 'Admin not found' })
      }
      res.status(200).json({ success: true, admin: adminUser })
    } catch (error) {
      console.error('Get admin profile error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, email, currentPassword, newPassword } = req.body
      const adminUser = await Admin.findById(admin.id)

      if (!adminUser) {
        return res.status(404).json({ error: 'Admin not found' })
      }

      // Update name if provided
      if (name) {
        adminUser.name = name.trim()
      }

      // Update email if provided
      if (email && email !== adminUser.email) {
        // Check if email is already taken
        const existingAdmin = await Admin.findOne({ email: email.toLowerCase() })
        if (existingAdmin && existingAdmin._id.toString() !== admin.id) {
          return res.status(400).json({ error: 'Email already in use' })
        }
        adminUser.email = email.toLowerCase().trim()
      }

      // Update password if provided
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ error: 'Current password is required to change password' })
        }

        // Verify current password
        const isPasswordValid = await adminUser.comparePassword(currentPassword)
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Current password is incorrect' })
        }

        // Validate new password
        if (newPassword.length < 6) {
          return res.status(400).json({ error: 'New password must be at least 6 characters' })
        }

        // Hash new password
        adminUser.password = newPassword
      }

      await adminUser.save()

      // Return updated admin without password
      const adminResponse = {
        id: adminUser._id.toString(),
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        createdAt: adminUser.createdAt
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        admin: adminResponse
      })
    } catch (error) {
      console.error('Update admin profile error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}



