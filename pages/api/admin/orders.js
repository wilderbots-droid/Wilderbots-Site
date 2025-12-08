import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import Order from '../../../models/Order'

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
        query.$or = [
          { trackingNumber: { $regex: search, $options: 'i' } }
        ]
      }

      const orders = await Order.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean()

      const total = await Order.countDocuments(query)

      res.status(200).json({
        success: true,
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      })
    } catch (error) {
      console.error('Get orders error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query
      const { status } = req.body

      if (!status) {
        return res.status(400).json({ error: 'Status is required' })
      }

      const order = await Order.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      ).populate('userId', 'name email')

      res.status(200).json({ success: true, order })
    } catch (error) {
      console.error('Update order error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      await Order.findByIdAndDelete(id)
      res.status(200).json({ success: true, message: 'Order deleted successfully' })
    } catch (error) {
      console.error('Delete order error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

