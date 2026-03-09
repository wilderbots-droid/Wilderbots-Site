import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()

    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email/Mobile and password are required' })
    }

    // Determine if input is email or mobile
    const isEmail = email.includes('@')
    let user

    if (isEmail) {
      // Find user by email
      user = await User.findOne({ email: email.toLowerCase() })
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }
    } else {
      // Find user by mobile
      const mobileRegex = /^[0-9]{10}$/
      if (!mobileRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email or 10-digit mobile number' })
      }
      user = await User.findOne({ phone: email })
      if (!user) {
        return res.status(401).json({ error: 'Invalid mobile number or password' })
      }
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ 
        error: 'Your account has been blocked. Please contact support for assistance.',
        blocked: true,
        blockedReason: user.blockedReason
      })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: isEmail ? 'Invalid email or password' : 'Invalid mobile number or password' })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return user without password
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Failed to login. Please try again.' })
  }
}

