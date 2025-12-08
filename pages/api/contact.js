import connectDB from '../../lib/mongodb'
import Contact from '../../models/Contact'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()

    const { name, email, subject, category, message } = req.body

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Try to get userId from token if user is logged in
    let userId = null
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        userId = decoded.userId
      } catch (error) {
        // Token invalid, continue without userId
      }
    }

    // Create contact submission
    const contact = await Contact.create({
      userId: userId || null,
      name,
      email,
      subject: subject || '',
      category: category || 'general',
      message,
      status: 'new'
    })

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      contact: {
        id: contact._id
      }
    })
  } catch (error) {
    console.error('Contact submission error:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    }

    res.status(500).json({ error: 'Failed to submit contact form. Please try again later.' })
  }
}

