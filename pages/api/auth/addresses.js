import connectDB from '../../../lib/mongodb'
import SavedAddress from '../../../models/SavedAddress'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export default async function handler(req, res) {
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

    if (req.method === 'GET') {
      // Get all addresses for user
      const addresses = await SavedAddress.find({ userId })
        .sort({ isDefault: -1, createdAt: -1 })
        .lean()

      res.status(200).json({
        success: true,
        addresses
      })
    } else if (req.method === 'POST') {
      // Create new address
      const {
        label,
        firstName,
        lastName,
        phone,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault
      } = req.body

      if (!firstName || !lastName || !street || !city || !zipCode || !country) {
        return res.status(400).json({ error: 'Required fields are missing' })
      }

      // If this is set as default, unset other defaults
      if (isDefault) {
        await SavedAddress.updateMany(
          { userId },
          { $set: { isDefault: false } }
        )
      }

      const address = await SavedAddress.create({
        userId,
        label: label || 'Home',
        firstName,
        lastName,
        phone: phone || '',
        street,
        city,
        state: state || '',
        zipCode,
        country,
        isDefault: isDefault || false
      })

      res.status(201).json({
        success: true,
        address
      })
    } else if (req.method === 'PUT') {
      // Update address
      const { id } = req.query
      const {
        label,
        firstName,
        lastName,
        phone,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault
      } = req.body

      const address = await SavedAddress.findOne({ _id: id, userId })
      if (!address) {
        return res.status(404).json({ error: 'Address not found' })
      }

      // If setting as default, unset other defaults
      if (isDefault && !address.isDefault) {
        await SavedAddress.updateMany(
          { userId, _id: { $ne: id } },
          { $set: { isDefault: false } }
        )
      }

      address.label = label || address.label
      address.firstName = firstName || address.firstName
      address.lastName = lastName || address.lastName
      address.phone = phone !== undefined ? phone : address.phone
      address.street = street || address.street
      address.city = city || address.city
      address.state = state !== undefined ? state : address.state
      address.zipCode = zipCode || address.zipCode
      address.country = country || address.country
      address.isDefault = isDefault !== undefined ? isDefault : address.isDefault

      await address.save()

      res.status(200).json({
        success: true,
        address
      })
    } else if (req.method === 'DELETE') {
      // Delete address
      const { id } = req.query

      const address = await SavedAddress.findOneAndDelete({ _id: id, userId })
      if (!address) {
        return res.status(404).json({ error: 'Address not found' })
      }

      res.status(200).json({
        success: true,
        message: 'Address deleted successfully'
      })
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Address API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

