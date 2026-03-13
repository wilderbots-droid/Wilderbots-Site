import admin from 'firebase-admin'
import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function initFirebaseAdmin() {
  if (admin.apps && admin.apps.length) return

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
    } else {
      admin.initializeApp()
    }
  } catch (err) {
    // If already initialized in some environments
    if (!admin.apps || !admin.apps.length) {
      throw err
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { idToken, type } = req.body || {}

  if (!idToken) {
    return res.status(400).json({ error: 'idToken is required' })
  }

  try {
    initFirebaseAdmin()
    const decoded = await admin.auth().verifyIdToken(idToken)

    if (!decoded || !decoded.uid) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    await connectDB()

    const email = decoded.email && decoded.email.toLowerCase()
    const name = decoded.name || decoded.displayName || 'User'
    const photoURL = decoded.picture || null

    let user = null
    if (email) {
      user = await User.findOne({ email })
    }

    if (!user) {
      // create user if not exists (allow for both signup and login flows)
      const newUser = await User.create({
        name,
        email,
        authProvider: 'google',
        authProviderId: decoded.uid,
        avatar: photoURL,
        isEmailVerified: true,
        lastLogin: new Date()
      })
      user = newUser
    } else {
      // update auth provider id if missing
      if (!user.authProviderId) {
        user.authProvider = 'google'
        user.authProviderId = decoded.uid
      }
      user.lastLogin = new Date()
      await user.save()
    }

    const token = jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '7d' })

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }

    return res.status(200).json({ success: true, user: userResponse, token })
  } catch (error) {
    console.error('Firebase login error:', error)
    return res.status(500).json({ error: 'Failed to verify token or create user' })
  }
}
