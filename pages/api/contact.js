import connectDB from '../../lib/mongodb'
import Contact from '../../models/Contact'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Contact submission received')
    console.log('Request body:', req.body)

    await connectDB()
    console.log('Database connected')

    const { name, email, subject, category, message } = req.body

    // Validate required fields
    if (!name || !email || !message) {
      console.error('Missing required fields:', { name: !!name, email: !!email, message: !!message })
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email)
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Try to get userId from token if user is logged in
    let userId = null
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        userId = decoded.userId
        console.log('User authenticated:', userId)
      } catch (error) {
        console.log('Token invalid or expired, continuing as anonymous')
      }
    }

    // Create contact submission
    console.log('Creating contact submission...')
    const contactData = {
      userId: userId || null,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: (subject || '').trim(),
      category: category || 'general',
      message: message.trim(),
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('Contact data:', contactData)

    const contact = new Contact(contactData)
    const savedContact = await contact.save()

    console.log('✅ Contact saved successfully:', savedContact._id)

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      contact: {
        id: savedContact._id
      }
    })
  } catch (error) {
    console.error('❌ Contact submission error')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)

    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.errors)
      const messages = Object.entries(error.errors || {})
        .map(([field, err]) => `${field}: ${err.message}`)
      const errorMessage = messages.join('; ') || error.message
      return res.status(400).json({ error: errorMessage })
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      console.error('Duplicate key error')
      return res.status(400).json({ error: 'This contact already exists' })
    }

    const errorMessage = process.env.NODE_ENV === 'development'
      ? `Error: ${error.message}`
      : 'Failed to submit contact form. Please try again later.'

    return res.status(500).json({ error: errorMessage })
  }
}

