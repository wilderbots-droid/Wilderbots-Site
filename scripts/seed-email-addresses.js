import mongoose from 'mongoose'
import connectDB from '../lib/mongodb.js'
import EmailAddress from '../models/EmailAddress.js'

const emailAddresses = [
  {
    label: 'Careers Team',
    email: 'careers@wilderbots.com',
    purpose: 'career',
    description: 'For job applications and career inquiries',
    isActive: true,
    isPrimary: false
  },
  {
    label: 'Support Team',
    email: 'support@wilderbots.com',
    purpose: 'support',
    description: 'Product support, technical assistance, and customer service',
    isActive: true,
    isPrimary: true
  }
]

async function seedEmailAddresses() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing email addresses (optional - comment out if you want to keep existing ones)
    // await EmailAddress.deleteMany({})
    // console.log('Cleared existing email addresses')

    // Check if emails already exist
    for (const emailData of emailAddresses) {
      const existing = await EmailAddress.findOne({ email: emailData.email })
      if (existing) {
        console.log(`Email ${emailData.email} already exists, skipping...`)
        continue
      }

      // If setting as primary, unset other primary emails
      if (emailData.isPrimary) {
        await EmailAddress.updateMany(
          { isPrimary: true },
          { $set: { isPrimary: false } }
        )
      }

      const emailAddress = await EmailAddress.create(emailData)
      console.log(`✓ Created email address: ${emailAddress.email} (${emailAddress.purpose})`)
    }

    console.log('\n✅ Email addresses seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding email addresses:', error)
    process.exit(1)
  }
}

seedEmailAddresses()


