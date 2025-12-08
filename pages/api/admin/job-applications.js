import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import JobApplication from '../../../models/JobApplication'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 20, status = '', search = '' } = req.query
      const skip = (parseInt(page) - 1) * parseInt(limit)

      const query = {}
      if (status) query.status = status
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { position: { $regex: search, $options: 'i' } }
        ]
      }

      const applications = await JobApplication.find(query)
        .populate('careerId', 'title department')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean()

      const total = await JobApplication.countDocuments(query)

      res.status(200).json({
        success: true,
        applications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      })
    } catch (error) {
      console.error('Get job applications error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query
      const application = await JobApplication.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      ).populate('careerId', 'title department')
      res.status(200).json({ success: true, application })
    } catch (error) {
      console.error('Update job application error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      await JobApplication.findByIdAndDelete(id)
      res.status(200).json({ success: true, message: 'Application deleted successfully' })
    } catch (error) {
      console.error('Delete job application error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

