import connectDB from '../../lib/mongodb'
import Subscription from '../../models/Subscription'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()

    const { email } = req.body

    // Validate email
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Check if email already exists
    const existingSubscription = await Subscription.findOne({ email: email.toLowerCase() })

    if (existingSubscription) {
      if (existingSubscription.status === 'unsubscribed') {
        // Reactivate subscription
        existingSubscription.status = 'active'
        existingSubscription.unsubscribedAt = null
        await existingSubscription.save()
        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
          subscription: {
            id: existingSubscription._id,
            email: existingSubscription.email
          }
        })
      } else {
        // Already subscribed
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

    // Create new subscription
    const subscription = await Subscription.create({
      email: email.toLowerCase(),
      status: 'active',
      source: 'newsletter'
    })

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing! Check your email for confirmation.',
      subscription: {
        id: subscription._id,
        email: subscription.email
      }
    })
  } catch (error) {
    console.error('Subscription error:', error)
    
    // Handle duplicate key error (unique email constraint)
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter!'
      })
    }

    res.status(500).json({ error: 'Failed to process subscription. Please try again later.' })
  }
}

