import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
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
      res.status(200).json({ success: true, companyInfo })
    } catch (error) {
      console.error('Get company info error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      let companyInfo = await CompanyInfo.findOne()
      if (!companyInfo) {
        companyInfo = new CompanyInfo(req.body)
      } else {
        Object.assign(companyInfo, req.body)
      }
      await companyInfo.save()
      res.status(200).json({ success: true, companyInfo })
    } catch (error) {
      console.error('Update company info error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

