import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import User from '../../../models/User'
import Order from '../../../models/Order'
import Subscription from '../../../models/Subscription'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const admin = getAdminFromRequest(req)
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    await connectDB()

    const totalUsers = await User.countDocuments()
    const totalOrders = await Order.countDocuments()
    const pendingOrders = await Order.countDocuments({ status: 'pending' })
    const totalSubscriptions = await Subscription.countDocuments({ status: 'active' })
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email createdAt')
      .lean()

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        pendingOrders,
        totalSubscriptions
      },
      ordersByStatus,
      recentOrders,
      recentUsers
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

