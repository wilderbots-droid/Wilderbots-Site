import connectDB from '../../../lib/mongodb'
import Maintenance from '../../../models/Maintenance'
import { getAdminFromRequest } from '../../../lib/adminAuth'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const admin = getAdminFromRequest(req)
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    await connectDB()

    if (req.method === 'GET') {
      const maintenance = await Maintenance.getMaintenance()
      res.status(200).json({
        success: true,
        maintenance: {
          isActive: maintenance.isActive,
          message: maintenance.message,
          endTime: maintenance.endTime
        }
      })
    } else if (req.method === 'PUT') {
      const { isActive, message, endTime } = req.body

      let maintenance = await Maintenance.findOne()
      if (!maintenance) {
        maintenance = await Maintenance.create({
          isActive: isActive || false,
          message: message || 'We are currently performing scheduled maintenance. We will be back shortly!',
          endTime: endTime || null
        })
      } else {
        maintenance.isActive = isActive !== undefined ? isActive : maintenance.isActive
        maintenance.message = message || maintenance.message
        maintenance.endTime = endTime || null
        maintenance.updatedAt = new Date()
        await maintenance.save()
      }

      res.status(200).json({
        success: true,
        maintenance: {
          isActive: maintenance.isActive,
          message: maintenance.message,
          endTime: maintenance.endTime
        }
      })
    }
  } catch (error) {
    console.error('Maintenance API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

