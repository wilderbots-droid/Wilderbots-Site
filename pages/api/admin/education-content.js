import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import EducationContent from '../../../models/EducationContent'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const content = await EducationContent.findOne().lean()
      res.status(200).json({ success: true, content })
    } catch (error) {
      console.error('Get admin education error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST' || req.method === 'PUT') {
    try {
      let content = await EducationContent.findOne()
      if (content) {
        content = await EducationContent.findByIdAndUpdate(content._id, req.body, { new: true })
      } else {
        content = new EducationContent(req.body)
        await content.save()
      }
      res.status(200).json({ success: true, content })
    } catch (error) {
      console.error('Update education error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
