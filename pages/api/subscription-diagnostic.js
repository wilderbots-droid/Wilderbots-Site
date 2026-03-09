import connectDB from '../../lib/mongodb'
import Subscription from '../../models/Subscription'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  try {
    console.log('=== SUBSCRIPTION SYSTEM DIAGNOSTIC ===')

    // Step 1: Connect to database
    console.log('\n1️⃣ Connecting to MongoDB...')
    await connectDB()
    console.log('✅ MongoDB connected')

    // Step 2: Check model
    console.log('\n2️⃣ Checking Subscription model...')
    console.log('Model name:', Subscription.modelName)
    console.log('Collection name:', Subscription.collection.name)
    const schemaFields = Object.keys(Subscription.schema.paths)
    console.log('Schema fields:', schemaFields)

    // Step 3: Count existing subscriptions
    console.log('\n3️⃣ Checking existing subscriptions...')
    const totalCount = await Subscription.countDocuments({})
    console.log(`Total subscriptions in DB: ${totalCount}`)

    // Step 4: Try a simple save operation
    console.log('\n4️⃣ Testing save operation...')
    const testEmail = `diagnostic_${Date.now()}@test.local`
    
    const testDoc = new Subscription({
      email: testEmail,
      status: 'active',
      source: 'diagnostic'
    })

    const saved = await testDoc.save()
    console.log('✅ Document saved successfully')
    console.log('Saved document ID:', saved._id)
    console.log('Saved document email:', saved.email)
    console.log('Saved document status:', saved.status)

    // Step 5: Verify it was saved
    console.log('\n5️⃣ Verifying saved document...')
    const found = await Subscription.findById(saved._id)
    if (found) {
      console.log('✅ Document found in database')
      console.log('Found document:', { id: found._id, email: found.email, status: found.status })
    } else {
      console.error('❌ Document not found!')
    }

    return res.status(200).json({
      success: true,
      message: 'Subscription system is working correctly!',
      diagnostic: {
        databaseConnection: '✅ Connected',
        model: {
          name: Subscription.modelName,
          collection: Subscription.collection.name,
          fields: schemaFields
        },
        database: {
          totalSubscriptions: totalCount,
          testEmailCreated: testEmail,
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
        code: error.code,
        mongoError: error.mongoError ? error.mongoError.message : null
      }
    })
  }
}
