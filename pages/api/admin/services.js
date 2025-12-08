import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import Service from '../../../models/Service'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const services = await Service.find().sort({ order: 1, createdAt: -1 }).lean()
      res.status(200).json({ success: true, services })
    } catch (error) {
      console.error('Get services error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const service = new Service(req.body)
      await service.save()
      res.status(201).json({ success: true, service })
    } catch (error) {
      console.error('Create service error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query
      const service = await Service.findByIdAndUpdate(id, req.body, { new: true })
      res.status(200).json({ success: true, service })
    } catch (error) {
      console.error('Update service error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      await Service.findByIdAndDelete(id)
      res.status(200).json({ success: true, message: 'Service deleted successfully' })
    } catch (error) {
      console.error('Delete service error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

