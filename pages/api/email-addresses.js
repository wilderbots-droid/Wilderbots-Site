import connectDB from '../../lib/mongodb'
import EmailAddress from '../../models/EmailAddress'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()

    // Fetch only active email addresses
    const emailAddresses = await EmailAddress.find({ isActive: true })
      .sort({ isPrimary: -1, createdAt: -1 })
      .lean()

    res.status(200).json({
      success: true,
      emailAddresses
    })
  } catch (error) {
    console.error('Get email addresses error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

