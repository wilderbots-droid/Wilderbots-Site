import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import Subscription from '../../../models/Subscription'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 20, status = '', search = '' } = req.query
      const skip = (parseInt(page) - 1) * parseInt(limit)

      const query = {}
      if (status) query.status = status
      if (search) {
        query.email = { $regex: search, $options: 'i' }
      }

      const subscriptions = await Subscription.find(query)
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean()

      const total = await Subscription.countDocuments(query)

      res.status(200).json({
        success: true,
        subscriptions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      })
    } catch (error) {
      console.error('Get subscriptions error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query
      const { status } = req.body

      const updateData = { status }
      if (status === 'unsubscribed') {
        updateData.unsubscribedAt = new Date()
      } else if (status === 'active') {
        updateData.unsubscribedAt = null
      }

      const subscription = await Subscription.findByIdAndUpdate(id, updateData, { new: true })
      res.status(200).json({ success: true, subscription })
    } catch (error) {
      console.error('Update subscription error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      await Subscription.findByIdAndDelete(id)
      res.status(200).json({ success: true, message: 'Subscription deleted successfully' })
    } catch (error) {
      console.error('Delete subscription error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

