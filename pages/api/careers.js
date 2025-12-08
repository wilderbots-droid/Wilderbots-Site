import connectDB from '../../lib/mongodb'
import Career from '../../models/Career'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()
    const careers = await Career.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-isActive -createdAt -updatedAt')
      .lean()

    res.status(200).json({ success: true, careers })
  } catch (error) {
    console.error('Get careers error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

