import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import ProcessStep from '../../../models/ProcessStep'
import CompanyInfo from '../../../models/CompanyInfo'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const companyInfo = await CompanyInfo.getCompanyInfo()
      const metadata = companyInfo.processSection || {
        title: 'Your Journey.',
        badgeText: 'Our Process'
      }
      const steps = await ProcessStep.find().sort({ order: 1, createdAt: 1 }).lean()
      res.status(200).json({ success: true, metadata, steps })
    } catch (error) {
      console.error('Get admin process steps error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const step = new ProcessStep(req.body)
      await step.save()
      res.status(201).json({ success: true, step })
    } catch (error) {
      console.error('Create process step error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, type } = req.query
      
      if (type === 'metadata') {
        let companyInfo = await CompanyInfo.findOne()
        if (!companyInfo) {
          companyInfo = new CompanyInfo({ processSection: req.body })
        } else {
          companyInfo.processSection = req.body
        }
        await companyInfo.save()
        return res.status(200).json({ success: true, metadata: companyInfo.processSection })
      }

      const step = await ProcessStep.findByIdAndUpdate(id, req.body, { new: true })
      res.status(200).json({ success: true, step })
    } catch (error) {
      console.error('Update process step error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      await ProcessStep.findByIdAndDelete(id)
      res.status(200).json({ success: true, message: 'Step deleted successfully' })
    } catch (error) {
      console.error('Delete process step error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
