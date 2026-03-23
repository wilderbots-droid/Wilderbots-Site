import connectDB from '../../lib/mongodb'
import Stat from '../../models/Stat'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()
    
    const stats = await Stat.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean()

    res.status(200).json({ success: true, stats })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
