import mongoose from 'mongoose'

const SubscriptionSchema = new mongoose.Schema({
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

SubscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  if (this.status === 'unsubscribed' && !this.unsubscribedAt) {
    this.unsubscribedAt = Date.now()
  }
  next()
})

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema)

