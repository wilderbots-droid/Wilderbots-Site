import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import { testSMTPConnection } from '../../../lib/emailService'
import { testIMAPConnection as testIMAP } from '../../../lib/imapService'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  await connectDB()

  try {
    const { config, type } = req.body

    if (!config) {
      return res.status(400).json({ error: 'Config is required' })
    }

    if (type === 'smtp') {
      const result = await testSMTPConnection(config)
      return res.status(200).json(result)
    } else if (type === 'imap') {
      const result = await testIMAP(config)
      return res.status(200).json(result)
    } else {
      return res.status(400).json({ error: 'Invalid type. Use "smtp" or "imap"' })
    }
  } catch (error) {
    console.error('Test connection error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

