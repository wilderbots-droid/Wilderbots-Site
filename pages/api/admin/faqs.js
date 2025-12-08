import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import FAQ from '../../../models/FAQ'

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
      const faqs = await FAQ.find(query).sort({ order: 1, createdAt: -1 }).lean()
      res.status(200).json({ success: true, faqs })
    } catch (error) {
      console.error('Get FAQs error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const faq = new FAQ(req.body)
      await faq.save()
      res.status(201).json({ success: true, faq })
    } catch (error) {
      console.error('Create FAQ error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query
      const faq = await FAQ.findByIdAndUpdate(id, req.body, { new: true })
      res.status(200).json({ success: true, faq })
    } catch (error) {
      console.error('Update FAQ error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      await FAQ.findByIdAndDelete(id)
      res.status(200).json({ success: true, message: 'FAQ deleted successfully' })
    } catch (error) {
      console.error('Delete FAQ error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

