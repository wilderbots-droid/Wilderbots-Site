import mongoose from 'mongoose'

const CompanyInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Wilderbots'
  },
  email: {
    type: String,
    default: 'hello@wilderbots.com'
  },
  phone: {
    type: String,
    default: '+1 (555) 123-4567'
  },
  mapUrl: {
    type: String,
    default: 'https://www.google.com/maps/place/WILDERBOTS+TECHNOLOGIES+PRIVATE+LIMITED/data=!4m2!3m1!1s0x3bae1707ff3e16a3:0x2e482c0f5dfa5a53?hl=en&trk=https%3A%2F%2Fc.gle%2FAOExmq1S2OsXyCFYzXTGVpyV32ZqWBNcFPW5PPXFO01rhc6xOueoVKv7RSbyjLPTqzIlirA_xxyyuY-yMqasamfalCKtIjQhHAemh8bsjGoQegUa8O-JMVzYGke50nkTnOxCDkc'
  },
  mapEmbedUrl: {
    type: String,
    default: 'https://www.google.com/maps?q=WILDERBOTS%20TECHNOLOGIES%20PRIVATE%20LIMITED&z=15&output=embed'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  businessHours: {
    type: String,
    default: 'Monday - Friday: 9:00 AM - 6:00 PM'
  },
  timezone: {
    type: String,
    default: 'Pacific Standard Time'
  },
  departments: [{
    title: String,
    email: String,
    description: String
  }],
  socialMedia: {
    linkedin: String,
    github: String,
    twitter: String,
    instagram: String,
    youtube: String
  },
  processSection: {
    title: {
      type: String,
      default: 'Your Journey.'
    },
    badgeText: {
      type: String,
      default: 'Our Process'
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Ensure only one document exists
CompanyInfoSchema.statics.getCompanyInfo = async function() {
  let companyInfo = await this.findOne()
  if (!companyInfo) {
    companyInfo = await this.create({
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
      }
    })
  }
  return companyInfo
}

export default mongoose.models.CompanyInfo || mongoose.model('CompanyInfo', CompanyInfoSchema)
