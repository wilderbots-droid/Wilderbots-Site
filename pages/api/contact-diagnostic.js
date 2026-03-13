import connectDB from '../../lib/mongodb'
import Contact from '../../models/Contact'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  try {
    console.log('=== CONTACT SYSTEM DIAGNOSTIC ===')

    // Step 1: Connect to database
    console.log('\n1️⃣ Connecting to MongoDB...')
    await connectDB()
    console.log('✅ MongoDB connected')

    // Step 2: Check model
    console.log('\n2️⃣ Checking Contact model...')
    console.log('Model name:', Contact.modelName)
    console.log('Collection name:', Contact.collection.name)
    const schemaFields = Object.keys(Contact.schema.paths)
    console.log('Schema fields:', schemaFields)

    // Step 3: Count existing contacts
    console.log('\n3️⃣ Checking existing contacts...')
    const totalCount = await Contact.countDocuments({})
    console.log(`Total contacts in DB: ${totalCount}`)

    // Step 4: Try a simple save operation
    console.log('\n4️⃣ Testing save operation...')
    const testContact = new Contact({
      name: 'Test User',
      email: `test_${Date.now()}@test.local`,
      subject: 'Test Subject',
      category: 'general',
      message: 'This is a test contact message from diagnostic endpoint',
      status: 'new'
    })

    const saved = await testContact.save()
    console.log('✅ Contact saved successfully')
    console.log('Saved contact ID:', saved._id)
    console.log('Saved contact name:', saved.name)
    console.log('Saved contact status:', saved.status)

    // Step 5: Verify it was saved
    console.log('\n5️⃣ Verifying saved contact...')
    const found = await Contact.findById(saved._id)
    if (found) {
      console.log('✅ Contact found in database')
      console.log('Found contact:', { id: found._id, name: found.name, email: found.email, status: found.status })
    } else {
      console.error('❌ Contact not found!')
    }

    return res.status(200).json({
      success: true,
      message: 'Contact system is working correctly!',
      diagnostic: {
        databaseConnection: '✅ Connected',
        model: {
          name: Contact.modelName,
          collection: Contact.collection.name,
          fields: schemaFields
        },
        database: {
          totalContacts: totalCount,
          testContactName: 'Test User',
          saveOperation: '✅ Success',
          verificationQuery: found ? '✅ Found' : '❌ Not found'
        }
      }
    })
  } catch (error) {
    console.error('\n❌ DIAGNOSTIC ERROR')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    console.error('Full error:')
    console.error(error)

    return res.status(500).json({
      success: false,
      error: 'Diagnostic failed',
      errorDetails: {
        type: error.constructor.name,
        message: error.message,
        code: error.code
      }
    })
  }
}
