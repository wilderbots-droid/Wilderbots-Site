import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import Review from '../../../models/Review'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const { category } = req.query
      const query = category ? { category } : {}
      const reviews = await Review.find(query).sort({ order: 1, createdAt: -1 }).lean()
      res.status(200).json({ success: true, reviews })
    } catch (error) {
      console.error('Get reviews error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const review = new Review(req.body)
      await review.save()
      res.status(201).json({ success: true, review })
    } catch (error) {
      console.error('Create review error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query
      const review = await Review.findByIdAndUpdate(id, req.body, { new: true })
      res.status(200).json({ success: true, review })
    } catch (error) {
      console.error('Update review error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      await Review.findByIdAndDelete(id)
      res.status(200).json({ success: true, message: 'Review deleted successfully' })
    } catch (error) {
      console.error('Delete review error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

