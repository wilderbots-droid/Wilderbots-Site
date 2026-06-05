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
        mapUrl: 'https://www.google.com/maps/place/WILDERBOTS+TECHNOLOGIES+PRIVATE+LIMITED/data=!4m2!3m1!1s0x3bae1707ff3e16a3:0x2e482c0f5dfa5a53?hl=en&trk=https%3A%2F%2Fc.gle%2FAOExmq1S2OsXyCFYzXTGVpyV32ZqWBNcFPW5PPXFO01rhc6xOueoVKv7RSbyjLPTqzIlirA_xxyyuY-yMqasamfalCKtIjQhHAemh8bsjGoQegUa8O-JMVzYGke50nkTnOxCDkc',
        mapEmbedUrl: 'https://www.google.com/maps?q=WILDERBOTS%20TECHNOLOGIES%20PRIVATE%20LIMITED&z=15&output=embed',
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
