import connectDB from '../../lib/mongodb'
import EducationContent from '../../models/EducationContent'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()
    const content = await EducationContent.findOne().lean()
    res.status(200).json({ success: true, content })
  } catch (error) {
    console.error('Get education error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
