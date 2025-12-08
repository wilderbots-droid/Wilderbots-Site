import mongoose from 'mongoose'

const EmailAddressSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  purpose: {
    type: String,
    enum: ['general', 'support', 'sales', 'info', 'marketing', 'billing', 'technical', 'career', 'other'],
    default: 'general'
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPrimary: {
    type: Boolean,
    default: false
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

// Ensure only one primary email exists
EmailAddressSchema.pre('save', async function() {
  if (this.isPrimary && this.isModified('isPrimary')) {
    await mongoose.model('EmailAddress').updateMany(
      { _id: { $ne: this._id } },
      { $set: { isPrimary: false } }
    )
  }
  this.updatedAt = Date.now()
})

export default mongoose.models.EmailAddress || mongoose.model('EmailAddress', EmailAddressSchema)

