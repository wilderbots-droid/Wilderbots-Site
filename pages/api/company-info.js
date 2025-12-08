import connectDB from '../../lib/mongodb'
import CompanyInfo from '../../models/CompanyInfo'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()
    let companyInfo = await CompanyInfo.findOne()
    
    if (!companyInfo) {
      // Return default if not found
      companyInfo = {
        name: 'Wilderbots',
        email: 'hello@wilderbots.com',
        phone: '+1 (555) 123-4567',
        address: {
          street: '123 Innovation Drive',
          city: 'Tech Valley',
          state: 'CA',
          zipCode: '94025',
          country: 'USA'
        },
        businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM',
        timezone: 'Pacific Standard Time',
        departments: [],
        socialMedia: {}
      }
    }

    res.status(200).json({ success: true, companyInfo })
  } catch (error) {
    console.error('Get company info error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

