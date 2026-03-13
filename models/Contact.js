import mongoose from 'mongoose'

// Minimal Contact schema without problematic hooks
const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String
  },
  category: {
    type: String,
    enum: ['general', 'product', 'services', 'education', 'partnership', 'careers', 'media'],
    default: 'general'
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  repliedAt: {
    type: Date
  },
  notes: {
    type: String
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

// Get or create model
let ContactModel

try {
  ContactModel = mongoose.model('Contact')
} catch (error) {
  ContactModel = mongoose.model('Contact', contactSchema)
}

export default ContactModel

