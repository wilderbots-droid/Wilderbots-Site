import connectDB from '../../lib/mongodb'
import Policy from '../../models/Policy'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()
    const { type } = req.query

    if (!type) {
      return res.status(400).json({ error: 'Policy type is required' })
    }

    const policy = await Policy.findOne({ type }).lean()

    // Return null if policy doesn't exist (pages will use default content)
    res.status(200).json({ success: true, policy: policy || null })
  } catch (error) {
    console.error('Get policy error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

