import mongoose from 'mongoose'

const PaymentConfigSchema = new mongoose.Schema({
  razorpayKeyId: {
    type: String,
    default: ''
  },
  razorpayKeySecret: {
    type: String,
    default: ''
  },
  isEnabled: {
    type: Boolean,
    default: false
  },
  webhookSecret: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Ensure only one document exists
PaymentConfigSchema.statics.getPaymentConfig = async function() {
  let paymentConfig = await this.findOne()
  if (!paymentConfig) {
    paymentConfig = await this.create({
      razorpayKeyId: '',
      razorpayKeySecret: '',
      isEnabled: false,
      webhookSecret: ''
    })
  }
  return paymentConfig
}

export default mongoose.models.PaymentConfig || mongoose.model('PaymentConfig', PaymentConfigSchema)
