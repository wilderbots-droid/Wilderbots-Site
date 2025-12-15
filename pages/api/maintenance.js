import connectDB from '../../lib/mongodb'
import Maintenance from '../../models/Maintenance'

export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'GET') {
    try {
      const maintenance = await Maintenance.getMaintenance()
      res.status(200).json({
        success: true,
        maintenance: {
          isActive: maintenance.isActive,
          message: maintenance.message,
          endTime: maintenance.endTime
        }
      })
    } catch (error) {
      console.error('Error fetching maintenance:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

