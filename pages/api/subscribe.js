import connectDB from '../../lib/mongodb'
import Subscription from '../../models/Subscription'

export default async function handler(req, res) {
  // Set CORS headers if needed
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let email = null

  try {
    // Ensure database connection
    console.log('Connecting to database...')
    await connectDB()
    console.log('Database connected')

    // Parse email from request body
    email = req.body?.email
    
    console.log('Received email:', email)
    console.log('Request body:', req.body)

    // Validate email exists
    if (!email) {
      console.error('Email is missing from request body')
      return res.status(400).json({ error: 'Email is required' })
    }

    // Validate email is a string
    if (typeof email !== 'string') {
      console.error('Email is not a string:', typeof email)
      return res.status(400).json({ error: 'Email must be a string' })
    }

    // Clean and normalize email
    const cleanEmail = email.toLowerCase().trim()
    console.log('Cleaned email:', cleanEmail)

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      console.error('Invalid email format:', cleanEmail)
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Check if email already exists
    console.log('Checking for existing subscription...')
    const existingSubscription = await Subscription.findOne({ email: cleanEmail })
    console.log('Existing subscription found:', existingSubscription ? 'yes' : 'no')

    if (existingSubscription) {
      console.log('Subscription status:', existingSubscription.status)
      
      if (existingSubscription.status === 'unsubscribed') {
        // Reactivate subscription
        console.log('Reactivating subscription')
        existingSubscription.status = 'active'
        existingSubscription.unsubscribedAt = null
        const updated = await existingSubscription.save()
        
        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
          subscription: {
            id: updated._id,
            email: updated.email
          }
        })
      } else {
        // Already subscribed
        console.log('Email already subscribed')
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to our newsletter!',
          subscription: {
            id: existingSubscription._id,
            email: existingSubscription.email
          }
        })
      }
    }

    // Create new subscription with explicit field values
    console.log('Creating new subscription for:', cleanEmail)
    
    const subscriptionData = {
      email: cleanEmail,
      status: 'active',
      source: 'newsletter',
      subscribedAt: new Date()
    }
    
    console.log('Subscription data:', subscriptionData)
    
    const newSubscription = new Subscription(subscriptionData)
    console.log('Subscription instance created')
    
    const savedSubscription = await newSubscription.save()
    console.log('✅ Subscription saved successfully:', savedSubscription._id)

    return res.status(201).json({
      success: true,
      message: 'Thank you for subscribing!',
      subscription: {
        id: savedSubscription._id,
        email: savedSubscription.email
      }
    })
  } catch (error) {
    console.error('❌ SUBSCRIPTION ERROR')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    console.error('Error details:', error)
    console.error('Full error object:', JSON.stringify(error, null, 2))
    
    // Handle duplicate key error
    if (error.code === 11000) {
      console.log('Duplicate key error detected. Email:', email)
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter!'
      })
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.log('Validation error details:', error.errors)
      const messages = Object.entries(error.errors)
        .map(([field, err]) => `${field}: ${err.message}`)
      const errorMessage = messages.join('; ')
      return res.status(400).json({ error: errorMessage })
    }

    // Handle cast errors
    if (error.name === 'CastError') {
      console.log('Cast error:', error.message)
      return res.status(400).json({ error: 'Invalid data format' })
    }

    // Generic server error
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Error: ${error.message}`
      : 'Failed to process subscription. Please try again later.'
    
    return res.status(500).json({ error: errorMessage })
  }
}

