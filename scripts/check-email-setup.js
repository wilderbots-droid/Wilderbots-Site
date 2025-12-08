/**
 * Check email addresses and SMTP configurations
 * Run with: node scripts/check-email-setup.js
 */

import connectDB from '../lib/mongodb.js'
import EmailAddress from '../models/EmailAddress.js'
import SMTPConfig from '../models/SMTPConfig.js'

async function checkEmailSetup() {
  try {
    await connectDB()
    console.log('Connected to MongoDB\n')
    console.log('='.repeat(50))
    console.log('Email Setup Status')
    console.log('='.repeat(50) + '\n')

    // Check Email Addresses
    console.log('📧 Email Addresses:')
    const emailAddresses = await EmailAddress.find().lean()
    if (emailAddresses.length === 0) {
      console.log('  ❌ No email addresses found')
      console.log('  Run: node scripts/seed-email-addresses.js\n')
    } else {
      emailAddresses.forEach((ea, index) => {
        console.log(`  ${index + 1}. ${ea.email}`)
        console.log(`     Label: ${ea.label}`)
        console.log(`     Purpose: ${ea.purpose}`)
        console.log(`     Status: ${ea.isActive ? '✅ Active' : '❌ Inactive'}`)
        console.log(`     Primary: ${ea.isPrimary ? '⭐ Yes' : 'No'}\n`)
      })
    }

    // Check SMTP Configurations
    console.log('⚙️  SMTP Configurations:')
    const smtpConfigs = await SMTPConfig.find().lean()
    if (smtpConfigs.length === 0) {
      console.log('  ❌ No SMTP configurations found')
      console.log('  To set up:')
      console.log('    1. Run: node scripts/setup-hostinger-smtp.js')
      console.log('    2. Or configure via Admin Panel → Email Management → SMTP Settings\n')
    } else {
      smtpConfigs.forEach((config, index) => {
        console.log(`  ${index + 1}. ${config.name}`)
        console.log(`     Email: ${config.from.address}`)
        console.log(`     SMTP: ${config.host}:${config.port} (${config.secure ? 'SSL' : 'TLS'})`)
        if (config.imap?.host) {
          console.log(`     IMAP: ${config.imap.host}:${config.imap.port} (${config.imap.secure ? 'SSL' : 'TLS'})`)
        } else {
          console.log(`     IMAP: ❌ Not configured`)
        }
        console.log(`     Status: ${config.isActive ? '✅ Active' : '❌ Inactive'}`)
        console.log(`     Default: ${config.isDefault ? '⭐ Yes' : 'No'}\n`)
      })
    }

    // Summary
    console.log('='.repeat(50))
    console.log('Summary:')
    console.log(`  Email Addresses: ${emailAddresses.length}`)
    console.log(`  SMTP Configurations: ${smtpConfigs.length}`)
    
    const activeConfigs = smtpConfigs.filter(c => c.isActive)
    const defaultConfig = smtpConfigs.find(c => c.isDefault && c.isActive)
    
    if (activeConfigs.length > 0) {
      console.log(`  Active Configs: ${activeConfigs.length}`)
    }
    
    if (defaultConfig) {
      console.log(`  Default Config: ✅ ${defaultConfig.name}`)
    } else if (smtpConfigs.length > 0) {
      console.log(`  Default Config: ⚠️  None set`)
    }

    // Check for Hostinger configs
    const hostingerConfigs = smtpConfigs.filter(c => 
      c.host === 'smtp.hostinger.com' || c.name.toLowerCase().includes('hostinger')
    )
    
    if (hostingerConfigs.length > 0) {
      console.log(`  Hostinger Configs: ✅ ${hostingerConfigs.length} found`)
    }

    console.log('='.repeat(50) + '\n')

    if (emailAddresses.length > 0 && smtpConfigs.length > 0 && defaultConfig) {
      console.log('✅ Email system is ready to use!')
      console.log('\nNext steps:')
      console.log('1. Test SMTP connection in Admin Panel')
      console.log('2. Test IMAP connection in Admin Panel')
      console.log('3. Send a test email')
    } else {
      console.log('⚠️  Email system needs configuration')
    }

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error checking email setup:', error)
    process.exit(1)
  }
}

checkEmailSetup()


