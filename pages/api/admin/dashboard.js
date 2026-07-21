import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import Contact from '../../../models/Contact'
import JobApplication from '../../../models/JobApplication'
import Product from '../../../models/Product'
import Service from '../../../models/Service'
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

    const totalContacts = await Contact.countDocuments()
    const totalApplications = await JobApplication.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalServices = await Service.countDocuments()
    const totalSubscriptions = await Subscription.countDocuments({ status: 'active' })
    const recentApplications = await JobApplication.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .lean()
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select('name email category createdAt')
      .lean()

    res.status(200).json({
      success: true,
      stats: {
        totalContacts,
        totalApplications,
        totalProducts,
        totalServices,
        totalSubscriptions
      },
      recentApplications,
      recentContacts
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
