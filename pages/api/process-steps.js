import connectDB from '../../lib/mongodb'
import ProcessStep from '../../models/ProcessStep'
import CompanyInfo from '../../models/CompanyInfo'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()
    
    // Get section metadata
    const companyInfo = await CompanyInfo.getCompanyInfo()
    const metadata = companyInfo.processSection || {
      title: 'Your Journey.',
      badgeText: 'Our Process'
    }

    // Get active steps
    const steps = await ProcessStep.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean()

    res.status(200).json({ 
      success: true, 
      metadata,
      steps 
    })
  } catch (error) {
    console.error('Get process steps error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
