import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import TeamMember from '../../../models/TeamMember'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const teamMembers = await TeamMember.find().sort({ order: 1, createdAt: -1 }).lean()
      res.status(200).json({ success: true, teamMembers })
    } catch (error) {
      console.error('Get team members error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const teamMember = new TeamMember(req.body)
      await teamMember.save()
      res.status(201).json({ success: true, teamMember })
    } catch (error) {
      console.error('Create team member error:', error)
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message)
        return res.status(400).json({ error: messages.join(', ') })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query
      const teamMember = await TeamMember.findByIdAndUpdate(id, req.body, { new: true })
      res.status(200).json({ success: true, teamMember })
    } catch (error) {
      console.error('Update team member error:', error)
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message)
        return res.status(400).json({ error: messages.join(', ') })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      await TeamMember.findByIdAndDelete(id)
      res.status(200).json({ success: true, message: 'Team member deleted successfully' })
    } catch (error) {
      console.error('Delete team member error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

