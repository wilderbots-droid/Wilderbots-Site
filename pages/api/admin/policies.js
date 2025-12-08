import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import Policy from '../../../models/Policy'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const { type } = req.query
      
      if (type) {
        const policy = await Policy.findOne({ type }).lean()
        res.status(200).json({ success: true, policy })
      } else {
        const policies = await Policy.find().sort({ type: 1 }).lean()
        res.status(200).json({ success: true, policies })
      }
    } catch (error) {
      console.error('Get policies error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { type } = req.query
      const { title, content } = req.body

      if (!type || !title || !content) {
        return res.status(400).json({ error: 'Type, title, and content are required' })
      }

      const policy = await Policy.findOneAndUpdate(
        { type },
        { title, content, lastUpdated: new Date() },
        { new: true, upsert: true }
      )

      res.status(200).json({ success: true, policy })
    } catch (error) {
      console.error('Update policy error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

