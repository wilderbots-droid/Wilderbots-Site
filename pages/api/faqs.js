import connectDB from '../../lib/mongodb'
import FAQ from '../../models/FAQ'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()
    const faqs = await FAQ.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('-isActive -createdAt -updatedAt')
      .lean()

    res.status(200).json({ success: true, faqs })
  } catch (error) {
    console.error('Get FAQs error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

