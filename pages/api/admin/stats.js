import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import Stat from '../../../models/Stat'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const statsList = await Stat.find().sort({ order: 1, createdAt: 1 }).lean()
      res.status(200).json({ success: true, stats: statsList })
    } catch (error) {
      console.error('Get admin stats error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const stat = new Stat(req.body)
      await stat.save()
      res.status(201).json({ success: true, stat })
    } catch (error) {
      console.error('Create stat error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query
      const stat = await Stat.findByIdAndUpdate(id, req.body, { new: true })
      res.status(200).json({ success: true, stat })
    } catch (error) {
      console.error('Update stat error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      await Stat.findByIdAndDelete(id)
      res.status(200).json({ success: true, message: 'Stat deleted successfully' })
    } catch (error) {
      console.error('Delete stat error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
