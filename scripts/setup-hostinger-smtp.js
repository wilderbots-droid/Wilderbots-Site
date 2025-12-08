/**
 * Script to set up Hostinger SMTP/IMAP configuration
 * Run with: node scripts/setup-hostinger-smtp.js
 * 
 * This will create SMTP configurations for your Hostinger email accounts
 * You'll need to provide the email passwords when prompted
 */

import readline from 'readline'
import connectDB from '../lib/mongodb.js'
import SMTPConfig from '../models/SMTPConfig.js'

let rl = null

function createReadline() {
  if (!rl) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
  }
  return rl
}

function question(query) {
  const rlInterface = createReadline()
  return new Promise((resolve) => {
    rlInterface.question(query, (answer) => {
      resolve(answer)
    })
  })
}

function closeReadline() {
  if (rl) {
    rl.close()
    rl = null
  }
}

async function setupHostingerSMTP() {
  try {
    await connectDB()
    console.log('Connected to MongoDB\n')

    console.log('Hostinger Email Configuration Setup')
    console.log('=====================================\n')
    console.log('Hostinger Server Settings:')
    console.log('- SMTP Host: smtp.hostinger.com')
    console.log('- SMTP Port: 465 (SSL)')
    console.log('- IMAP Host: imap.hostinger.com')
    console.log('- IMAP Port: 993 (SSL)\n')

    const configs = []

    // Setup for support@wilderbots.com
    console.log('Setting up support@wilderbots.com...')
    const supportPassword = await question('Enter password for support@wilderbots.com: ')
    if (!supportPassword || supportPassword.trim() === '') {
      console.log('Password is required. Exiting...')
      closeReadline()
      process.exit(1)
    }
    const supportNameInput = await question('Enter display name for support emails (default: Support Team): ')
    const supportName = supportNameInput.trim() || 'Support Team'
    
    configs.push({
      name: 'Hostinger - Support',
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: 'support@wilderbots.com',
        pass: supportPassword
      },
      from: {
        name: supportName,
        address: 'support@wilderbots.com'
      },
      imap: {
        host: 'imap.hostinger.com',
        port: 993,
        secure: true,
        auth: {
          user: 'support@wilderbots.com',
          pass: supportPassword
        }
      },
      isActive: true,
      isDefault: true // Set as default
    })

    // Setup for careers@wilderbots.com
    console.log('\nSetting up careers@wilderbots.com...')
    const careersPassword = await question('Enter password for careers@wilderbots.com: ')
    if (!careersPassword || careersPassword.trim() === '') {
      console.log('Password is required. Exiting...')
      closeReadline()
      process.exit(1)
    }
    const careersNameInput = await question('Enter display name for careers emails (default: Careers Team): ')
    const careersName = careersNameInput.trim() || 'Careers Team'
    
    configs.push({
      name: 'Hostinger - Careers',
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: 'careers@wilderbots.com',
        pass: careersPassword
      },
      from: {
        name: careersName,
        address: 'careers@wilderbots.com'
      },
      imap: {
        host: 'imap.hostinger.com',
        port: 993,
        secure: true,
        auth: {
          user: 'careers@wilderbots.com',
          pass: careersPassword
        }
      },
      isActive: true,
      isDefault: false
    })

    // Clear existing Hostinger configs
    console.log('\nClearing existing Hostinger configurations...')
    await SMTPConfig.deleteMany({ 
      $or: [
        { name: { $regex: /hostinger/i } },
        { host: 'smtp.hostinger.com' }
      ]
    })

    // Create configurations
    console.log('\nCreating SMTP configurations...')
    for (const configData of configs) {
      // If setting as default, unset other defaults
      if (configData.isDefault) {
        await SMTPConfig.updateMany(
          { isDefault: true },
          { $set: { isDefault: false } }
        )
      }

      const config = await SMTPConfig.create(configData)
      console.log(`✓ Created configuration: ${config.name}`)
      console.log(`  Email: ${config.from.address}`)
      console.log(`  SMTP: ${config.host}:${config.port}`)
      console.log(`  IMAP: ${config.imap.host}:${config.imap.port}`)
      console.log(`  Default: ${config.isDefault ? 'Yes' : 'No'}\n`)
    }

    console.log('\n✅ Hostinger SMTP/IMAP configuration completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Go to Admin Panel → Email Management → SMTP Settings')
    console.log('2. Test the SMTP and IMAP connections')
    console.log('3. Start sending and receiving emails!')
    
    closeReadline()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error setting up Hostinger SMTP:', error)
    closeReadline()
    process.exit(1)
  }
}

setupHostingerSMTP()

