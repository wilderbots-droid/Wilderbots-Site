import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import User from '../../../models/User'
import SavedAddress from '../../../models/SavedAddress'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 20, search = '' } = req.query
      const skip = (parseInt(page) - 1) * parseInt(limit)

      const query = search
        ? {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } }
            ]
          }
        : {}

      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean()

      // Fetch saved addresses count for each user
      const userIds = users.map(u => u._id)
      const addressesCount = await SavedAddress.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $group: { _id: '$userId', count: { $sum: 1 } } }
      ])

      const addressesMap = {}
      addressesCount.forEach(item => {
        addressesMap[item._id.toString()] = item.count
      })

      // Add addresses count to each user
      users.forEach(user => {
        user.savedAddressesCount = addressesMap[user._id.toString()] || 0
      })

      const total = await User.countDocuments(query)

      res.status(200).json({
        success: true,
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      })
    } catch (error) {
      console.error('Get users error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query
      const { isBlocked, blockedReason, name, email, phone, address, password } = req.body

      const user = await User.findById(id)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Handle block/unblock
      if (typeof isBlocked === 'boolean') {
        user.isBlocked = isBlocked
        if (isBlocked) {
          user.blockedAt = Date.now()
          user.blockedReason = blockedReason || 'Blocked by admin'
        } else {
          user.blockedAt = null
          user.blockedReason = null
        }
      }

      // Update name if provided
      if (name !== undefined) {
        user.name = name.trim()
      }

      // Update email if provided
      if (email && email !== user.email) {
        // Check if email is already taken
        const existingUser = await User.findOne({ email: email.toLowerCase() })
        if (existingUser && existingUser._id.toString() !== id) {
          return res.status(400).json({ error: 'Email already in use' })
        }
        user.email = email.toLowerCase().trim()
      }

      // Update phone if provided
      if (phone !== undefined) {
        user.phone = phone.trim() || ''
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

      // Update password if provided (admin can reset password without current password)
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({ error: 'Password must be at least 6 characters' })
        }
        user.password = await bcrypt.hash(password, 10)
      }

      await user.save()

      // Return updated user without password
      const userResponse = {
        ...user.toObject(),
        password: undefined
      }

      let message = 'User updated successfully'
      if (typeof isBlocked === 'boolean') {
        message = user.isBlocked ? 'User blocked successfully' : 'User unblocked successfully'
      }

      res.status(200).json({ success: true, user: userResponse, message })
    } catch (error) {
      console.error('Update user error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      await User.findByIdAndDelete(id)
      res.status(200).json({ success: true, message: 'User deleted successfully' })
    } catch (error) {
      console.error('Delete user error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

