import connectDB from '../../lib/mongodb'
import Subscription from '../../models/Subscription'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  try {
    console.log('=== TEST SUBSCRIBE ENDPOINT ===')

    // Test 1: Database connection
    console.log('Test 1: Testing database connection...')
    await connectDB()
    console.log('✅ Database connection successful')

    // Test 2: Check if model is loaded correctly
    console.log('Test 2: Checking Subscription model...')
    console.log('Model name:', Subscription.modelName)
    console.log('Model schema paths:', Object.keys(Subscription.schema.paths))

    // Test 3: Query existing subscriptions
    console.log('Test 3: Testing database query...')
    const count = await Subscription.countDocuments({})
    console.log('✅ Database query successful. Total subscriptions:', count)

    // Test 4: Create a test subscription
    console.log('Test 4: Creating test subscription...')
    const testEmail = `test_${Date.now()}@test.local`
    console.log('Test email:', testEmail)
    
    try {
      const newSub = new Subscription({
        email: testEmail,
        status: 'active',
        source: 'test'
      })
      
      console.log('Document created, attempting save...')
      const savedSub = await newSub.save()
      console.log('✅ Test subscription created:', savedSub._id)
      
      return res.status(200).json({
        success: true,
        message: 'All tests passed! The subscription system is working correctly.',
        details: {
          databaseConnection: '✅ Connected',
          modelLoaded: '✅ Subscription model loaded',
          databaseQuery: `✅ ${count} subscriptions in database`,
          subscriptionCreation: '✅ Test subscription created successfully',
          testEmail: testEmail,
          testId: savedSub._id.toString()
        }
      })
    } catch (saveError) {
      console.error('Error saving subscription:', saveError.message)
      console.error('Save error name:', saveError.name)
      console.error('Save error code:', saveError.code)
      throw saveError
    }
  } catch (error) {
    console.error('❌ TEST FAILED')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    
    return res.status(500).json({
      success: false,
      error: error.message,
      errorName: error.name,
      errorCode: error.code
    })
  }
}
