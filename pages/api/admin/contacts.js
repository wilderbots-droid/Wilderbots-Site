import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import Contact from '../../../models/Contact'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 20, status = '', category = '', search = '' } = req.query
      const skip = (parseInt(page) - 1) * parseInt(limit)

      const query = {}
      if (status) query.status = status
      if (category) query.category = category
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } }
        ]
      }

      const contacts = await Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean()

      const total = await Contact.countDocuments(query)

      res.status(200).json({
        success: true,
        contacts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      })
    } catch (error) {
      console.error('Get contacts error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query
      const contact = await Contact.findByIdAndUpdate(id, req.body, { new: true })
      res.status(200).json({ success: true, contact })
    } catch (error) {
      console.error('Update contact error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      await Contact.findByIdAndDelete(id)
      res.status(200).json({ success: true, message: 'Contact deleted successfully' })
    } catch (error) {
      console.error('Delete contact error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

