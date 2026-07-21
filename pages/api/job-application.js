import connectDB from '../../lib/mongodb'
import JobApplication from '../../models/JobApplication'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()

    const { careerId, name, email, phone, position, coverLetter, portfolio, linkedin, github, experience, whyWilderbots } = req.body

    // Validate required fields (careerId is optional for general applications)
    if (!name || !email || !position || !experience || !whyWilderbots) {
      return res.status(400).json({ error: 'Name, email, position, experience, and "Why Wilderbots" are required' })
    }

    // Trim whitespace
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPosition = position.trim()
    const trimmedExperience = experience.trim()
    const trimmedWhyWilderbots = whyWilderbots.trim()

    if (!trimmedName || !trimmedEmail || !trimmedPosition || !trimmedExperience || !trimmedWhyWilderbots) {
      return res.status(400).json({ error: 'Required fields cannot be empty' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Validate careerId if provided (must be valid ObjectId)
    let validCareerId = null
    if (careerId) {
      if (mongoose.Types.ObjectId.isValid(careerId)) {
        validCareerId = careerId
      } else {
        return res.status(400).json({ error: 'Invalid career ID format' })
      }
    }

    // Create job application
    const now = Date.now()
    const application = new JobApplication({
      userId: null,
      careerId: validCareerId || null,
      name: trimmedName,
      email: trimmedEmail,
      phone: phone ? phone.trim() : '',
      position: trimmedPosition,
      coverLetter: coverLetter ? coverLetter.trim() : '',
      portfolio: portfolio ? portfolio.trim() : '',
      linkedin: linkedin ? linkedin.trim() : '',
      github: github ? github.trim() : '',
      experience: trimmedExperience,
      whyWilderbots: trimmedWhyWilderbots,
      status: 'pending',
      updatedAt: now
    })

    await application.save()

    res.status(201).json({
      success: true,
      message: 'Your application has been submitted successfully! We will review it and get back to you soon.',
      application: {
        id: application._id
      }
    })
  } catch (error) {
    console.error('Job application submission error:', error)
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    }

    // Handle CastError (invalid ObjectId)
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid data format' })
    }

    res.status(500).json({ 
      error: 'Failed to submit application. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
