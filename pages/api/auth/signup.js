import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()

    const { name, email, password, mobile } = req.body

    // Validate input
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ error: 'Name, email, mobile, and password are required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Validate mobile format (10 digits only)
    const mobileRegex = /^[0-9]{10}$/
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ error: 'Mobile number must be exactly 10 digits' })
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists by email
    const existingUserByEmail = await User.findOne({ email: email.toLowerCase() })
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'This email is already registered' })
    }

    // Check if user already exists by mobile
    const existingUserByMobile = await User.findOne({ phone: mobile })
    if (existingUserByMobile) {
      return res.status(400).json({ error: 'This mobile number is already registered' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone: mobile,
      password: hashedPassword
    })

    // Return user without password
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userResponse
    })
  } catch (error) {
    console.error('Signup error:', error)
    
    // Handle duplicate key error
    if (error.code === 11000) {
      if (error.keyPattern.email) {
        return res.status(400).json({ error: 'This email is already registered' })
      }
      if (error.keyPattern.phone) {
        return res.status(400).json({ error: 'This mobile number is already registered' })
      }
    }

    res.status(500).json({ error: 'Failed to create user. Please try again.' })
  }
}

