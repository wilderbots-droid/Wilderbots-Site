import mongoose from 'mongoose'

const SavedAddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  label: {
    type: String,
    default: 'Home'
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  isDefault: {
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

SavedAddressSchema.pre('save', async function() {
  this.updatedAt = Date.now()
})


// Ensure only one default address per user
SavedAddressSchema.pre('save', async function() {
  if (this.isDefault && this.isModified('isDefault')) {
    await mongoose.model('SavedAddress').updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    )
  }
})


export default mongoose.models.SavedAddress || mongoose.model('SavedAddress', SavedAddressSchema)

