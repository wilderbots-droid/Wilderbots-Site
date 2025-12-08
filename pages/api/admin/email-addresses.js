import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import EmailAddress from '../../../models/EmailAddress'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const emailAddresses = await EmailAddress.find()
        .sort({ isPrimary: -1, createdAt: -1 })
        .lean()

      res.status(200).json({
        success: true,
        emailAddresses
      })
    } catch (error) {
      console.error('Get email addresses error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const { label, email, purpose, description, isActive, isPrimary } = req.body

      if (!label || !email) {
        return res.status(400).json({ error: 'Label and email are required' })
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' })
      }

      // If setting as primary, unset other primary emails
      if (isPrimary) {
        await EmailAddress.updateMany(
          { isPrimary: true },
          { $set: { isPrimary: false } }
        )
      }

      const emailAddress = await EmailAddress.create({
        label,
        email: email.toLowerCase(),
        purpose: purpose || 'general',
        description,
        isActive: isActive !== undefined ? isActive : true,
        isPrimary: isPrimary || false
      })

      res.status(201).json({
        success: true,
        emailAddress
      })
    } catch (error) {
      console.error('Create email address error:', error)
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Email address already exists' })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, label, email, purpose, description, isActive, isPrimary } = req.body

      if (!id) {
        return res.status(400).json({ error: 'Email address ID is required' })
      }

      const updateData = {}
      if (label !== undefined) updateData.label = label
      if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: 'Invalid email format' })
        }
        updateData.email = email.toLowerCase()
      }
      if (purpose !== undefined) updateData.purpose = purpose
      if (description !== undefined) updateData.description = description
      if (isActive !== undefined) updateData.isActive = isActive
      if (isPrimary !== undefined) {
        updateData.isPrimary = isPrimary
        // If setting as primary, unset other primary emails
        if (isPrimary) {
          await EmailAddress.updateMany(
            { _id: { $ne: id }, isPrimary: true },
            { $set: { isPrimary: false } }
          )
        }
      }

      const emailAddress = await EmailAddress.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      )

      if (!emailAddress) {
        return res.status(404).json({ error: 'Email address not found' })
      }

      res.status(200).json({
        success: true,
        emailAddress
      })
    } catch (error) {
      console.error('Update email address error:', error)
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Email address already exists' })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body

      if (!id) {
        return res.status(400).json({ error: 'Email address ID is required' })
      }

      const emailAddress = await EmailAddress.findById(id)
      if (!emailAddress) {
        return res.status(404).json({ error: 'Email address not found' })
      }

      // Prevent deleting primary email
      if (emailAddress.isPrimary) {
        return res.status(400).json({ error: 'Cannot delete primary email address' })
      }

      await EmailAddress.findByIdAndDelete(id)

      res.status(200).json({
        success: true,
        message: 'Email address deleted successfully'
      })
    } catch (error) {
      console.error('Delete email address error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

