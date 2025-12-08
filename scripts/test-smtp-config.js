/**
 * Test script to verify SMTP configurations exist and are valid
 * Run with: node scripts/test-smtp-config.js
 */

import connectDB from '../lib/mongodb.js'
import SMTPConfig from '../models/SMTPConfig.js'

async function testSMTPConfigs() {
  try {
    await connectDB()
    console.log('Connected to MongoDB\n')

    const configs = await SMTPConfig.find().lean()
    
    if (configs.length === 0) {
      console.log('❌ No SMTP configurations found.')
      console.log('\nTo set up Hostinger SMTP:')
      console.log('1. Run: node scripts/setup-hostinger-smtp.js')
      console.log('2. Or configure manually via Admin Panel → Email Management → SMTP Settings')
      process.exit(1)
    }

    console.log(`Found ${configs.length} SMTP configuration(s):\n`)
    
    configs.forEach((config, index) => {
      console.log(`${index + 1}. ${config.name}`)
      console.log(`   Email: ${config.from.address}`)
      console.log(`   SMTP: ${config.host}:${config.port} (${config.secure ? 'SSL' : 'TLS'})`)
      if (config.imap?.host) {
        console.log(`   IMAP: ${config.imap.host}:${config.imap.port} (${config.imap.secure ? 'SSL' : 'TLS'})`)
      } else {
        console.log(`   IMAP: Not configured`)
      }
      console.log(`   Status: ${config.isActive ? '✅ Active' : '❌ Inactive'}`)
      console.log(`   Default: ${config.isDefault ? 'Yes' : 'No'}`)
      console.log('')
    })

    const defaultConfig = configs.find(c => c.isDefault && c.isActive)
    if (defaultConfig) {
      console.log(`✅ Default active configuration: ${defaultConfig.name}`)
    } else {
      console.log('⚠️  No default active configuration found')
    }

    const hostingerConfigs = configs.filter(c => 
      c.host === 'smtp.hostinger.com' || c.name.toLowerCase().includes('hostinger')
    )
    
    if (hostingerConfigs.length > 0) {
      console.log(`\n✅ Found ${hostingerConfigs.length} Hostinger configuration(s)`)
    } else {
      console.log('\n⚠️  No Hostinger configurations found')
    }

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error checking SMTP configs:', error)
    process.exit(1)
  }
}

testSMTPConfigs()


