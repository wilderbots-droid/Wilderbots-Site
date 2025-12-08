import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()

    const { 
      items, 
      totalAmount, 
      shippingAddress, 
      contactInfo 
    } = req.body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' })
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ error: 'Valid total amount is required' })
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.country) {
      return res.status(400).json({ error: 'Complete shipping address is required' })
    }

    // Try to get userId from token if user is logged in
    let userId = null
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        userId = decoded.userId
      } catch (error) {
        // Token invalid, but we can still create order without userId
      }
    }

    // Generate unique tracking number
    const trackingNumber = 'WB' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 6).toUpperCase()

    // Create order
    const order = await Order.create({
      userId: userId || null,
      trackingNumber,
      status: 'pending', // Set to pending until payment is confirmed
      items: items.map(item => ({
        name: item.name || item.product || 'Wilder Watch Dev Kit',
        quantity: item.quantity || 1,
        price: item.price || totalAmount
      })),
      totalAmount,
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state || '',
        zipCode: shippingAddress.zipCode || shippingAddress.postalCode || '',
        country: shippingAddress.country
      },
      contactInfo: contactInfo || {},
      payment: {
        method: 'razorpay',
        status: 'pending'
      }
    })

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: order._id.toString(),
        trackingNumber: order.trackingNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt
      }
    })
  } catch (error) {
    console.error('Create order error:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    }

    res.status(500).json({ error: 'Failed to create order. Please try again.' })
  }
}

