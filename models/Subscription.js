import mongoose from 'mongoose'

// Absolutely minimal schema - no options, no hooks, no middleware
const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active'
  },
  source: {
    type: String,
    default: 'newsletter'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  }
})

// Get or create model
let SubscriptionModel

try {
  SubscriptionModel = mongoose.model('Subscription')
} catch (error) {
  SubscriptionModel = mongoose.model('Subscription', subscriptionSchema)
}

export default SubscriptionModel

