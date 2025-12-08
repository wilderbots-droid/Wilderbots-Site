import connectDB from '../../lib/mongodb'
import TeamMember from '../../models/TeamMember'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()
    const teamMembers = await TeamMember.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('-isActive -createdAt -updatedAt')
      .lean()

    res.status(200).json({ success: true, teamMembers })
  } catch (error) {
    console.error('Get team members error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

