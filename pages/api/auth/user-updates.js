import connectDB from '../../../lib/mongodb'
import Contact from '../../../models/Contact'
import JobApplication from '../../../models/JobApplication'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()

    // Get user from token
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const userId = decoded.userId

    // Fetch user's contacts
    const contacts = await Contact.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    // Fetch user's job applications
    const applications = await JobApplication.find({ userId })
      .populate('careerId', 'title department')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    // Count unread/new items
    const unreadContacts = contacts.filter(c => c.status === 'new').length
    const pendingApplications = applications.filter(a => ['pending', 'reviewing'].includes(a.status)).length

    res.status(200).json({
      success: true,
      contacts,
      applications,
      stats: {
        totalContacts: contacts.length,
        unreadContacts,
        totalApplications: applications.length,
        pendingApplications
      }
    })
  } catch (error) {
    console.error('Get user updates error:', error)
    res.status(500).json({ error: 'Failed to fetch updates' })
  }
}

