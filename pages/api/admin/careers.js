import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import Career from '../../../models/Career'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const { active } = req.query
      const query = active === 'true' ? { isActive: true } : {}
      const careers = await Career.find(query).sort({ createdAt: -1 }).lean()
      res.status(200).json({ success: true, careers })
    } catch (error) {
      console.error('Get careers error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const career = new Career(req.body)
      await career.save()
      res.status(201).json({ success: true, career })
    } catch (error) {
      console.error('Create career error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query
      const career = await Career.findByIdAndUpdate(id, req.body, { new: true })
      res.status(200).json({ success: true, career })
    } catch (error) {
      console.error('Update career error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      await Career.findByIdAndDelete(id)
      res.status(200).json({ success: true, message: 'Career deleted successfully' })
    } catch (error) {
      console.error('Delete career error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

