import connectDB from '../../../../lib/mongodb'
import { getAdminFromRequest } from '../../../../lib/adminAuth'
import Email from '../../../../models/Email'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const email = await Email.findById(id).lean()

      if (!email) {
        return res.status(404).json({ error: 'Email not found' })
      }

      res.status(200).json({
        success: true,
        email
      })
    } catch (error) {
      console.error('Get email error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { isRead, isStarred, isArchived, labels } = req.body

      const updateData = {}
      if (isRead !== undefined) updateData.isRead = isRead
      if (isStarred !== undefined) updateData.isStarred = isStarred
      if (isArchived !== undefined) updateData.isArchived = isArchived
      if (labels !== undefined) updateData.labels = labels

      const email = await Email.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      )

      if (!email) {
        return res.status(404).json({ error: 'Email not found' })
      }

      res.status(200).json({
        success: true,
        email
      })
    } catch (error) {
      console.error('Update email error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const email = await Email.findByIdAndDelete(id)

      if (!email) {
        return res.status(404).json({ error: 'Email not found' })
      }

      res.status(200).json({
        success: true,
        message: 'Email deleted successfully'
      })
    } catch (error) {
      console.error('Delete email error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}



