import connectDB from '../../../../../lib/mongodb'
import { getAdminFromRequest } from '../../../../../lib/adminAuth'
import SavedAddress from '../../../../../models/SavedAddress'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const { id } = req.query

      if (!id) {
        return res.status(400).json({ error: 'User ID is required' })
      }

      const addresses = await SavedAddress.find({ userId: id })
        .sort({ isDefault: -1, createdAt: -1 })
        .lean()

      res.status(200).json({
        success: true,
        addresses
      })
    } catch (error) {
      console.error('Get user addresses error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

