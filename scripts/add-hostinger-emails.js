/**
 * Simple script to add Hostinger SMTP configurations for two emails
 * Usage: node scripts/add-hostinger-emails.js <support-password> <careers-password>
 * 
 * Example:
 * node scripts/add-hostinger-emails.js "support123" "careers456"
 */

import connectDB from '../lib/mongodb.js'
import SMTPConfig from '../models/SMTPConfig.js'

const SUPPORT_EMAIL = 'support@wilderbots.com'
const CAREERS_EMAIL = 'careers@wilderbots.com'

async function addHostingerEmails() {
  try {
    // Get passwords from command line arguments
    const supportPassword = process.argv[2]
    const careersPassword = process.argv[3]

    if (!supportPassword || !careersPassword) {
      console.log('Usage: node scripts/add-hostinger-emails.js <support-password> <careers-password>')
      console.log('\nExample:')
      console.log('  node scripts/add-hostinger-emails.js "your-support-password" "your-careers-password"')
      process.exit(1)
    }

    await connectDB()
    console.log('Connected to MongoDB\n')

    console.log('Adding Hostinger SMTP configurations...\n')

    // Clear existing Hostinger configs
    await SMTPConfig.deleteMany({ 
      $or: [
        { name: { $regex: /hostinger/i } },
        { host: 'smtp.hostinger.com' },
        { 'from.address': { $in: [SUPPORT_EMAIL, CAREERS_EMAIL] } }
      ]
    })
    console.log('✓ Cleared existing Hostinger configurations\n')

    // Configuration for support@wilderbots.com
    const supportConfig = {
      name: 'Hostinger - Support',
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: SUPPORT_EMAIL,
        pass: supportPassword
      },
      from: {
        name: 'Support Team',
        address: SUPPORT_EMAIL
      },
      imap: {
        host: 'imap.hostinger.com',
        port: 993,
        secure: true,
        auth: {
          user: SUPPORT_EMAIL,
          pass: supportPassword
        }
      },
      isActive: true,
      isDefault: true // Set as default
    }

    // Configuration for careers@wilderbots.com
    const careersConfig = {
      name: 'Hostinger - Careers',
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: CAREERS_EMAIL,
        pass: careersPassword
      },
      from: {
        name: 'Careers Team',
        address: CAREERS_EMAIL
      },
      imap: {
        host: 'imap.hostinger.com',
        port: 993,
        secure: true,
        auth: {
          user: CAREERS_EMAIL,
          pass: careersPassword
        }
      },
      isActive: true,
      isDefault: false
    }

    // Unset other default configs before creating support config
    await SMTPConfig.updateMany(
      { isDefault: true },
      { $set: { isDefault: false } }
    )

    // Create support configuration (default)
    const support = await SMTPConfig.create(supportConfig)
    console.log(`✅ Created: ${support.name}`)
    console.log(`   Email: ${support.from.address}`)
    console.log(`   SMTP: ${support.host}:${support.port} (SSL)`)
    console.log(`   IMAP: ${support.imap.host}:${support.imap.port} (SSL)`)
    console.log(`   Default: Yes\n`)

    // Create careers configuration
    const careers = await SMTPConfig.create(careersConfig)
    console.log(`✅ Created: ${careers.name}`)
    console.log(`   Email: ${careers.from.address}`)
    console.log(`   SMTP: ${careers.host}:${careers.port} (SSL)`)
    console.log(`   IMAP: ${careers.imap.host}:${careers.imap.port} (SSL)`)
    console.log(`   Default: No\n`)

    console.log('='.repeat(50))
    console.log('✅ Successfully added both email configurations!')
    console.log('='.repeat(50))
    console.log('\nNext steps:')
    console.log('1. Go to Admin Panel → Email Management → SMTP Settings')
    console.log('2. Test SMTP and IMAP connections')
    console.log('3. Start sending emails!')
    console.log('\nTo verify: node scripts/check-email-setup.js\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error adding email configurations:', error.message)
    if (error.code === 11000) {
      console.error('   Duplicate configuration detected. Clearing and retrying...')
    }
    process.exit(1)
  }
}

addHostingerEmails()



