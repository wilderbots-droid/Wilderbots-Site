import mongoose from 'mongoose'

const EmailSchema = new mongoose.Schema({
  messageId: {
    type: String,
    unique: true,
    sparse: true
  },
  direction: {
    type: String,
    enum: ['sent', 'received'],
    required: true
  },
  from: {
    name: String,
    address: {
      type: String,
      required: true
    }
  },
  to: [{
    name: String,
    address: {
      type: String,
      required: true
    }
  }],
  cc: [{
    name: String,
    address: String
  }],
  bcc: [{
    name: String,
    address: String
  }],
  subject: {
    type: String,
    required: true
  },
  text: String,
  html: String,
  attachments: [{
    filename: String,
    contentType: String,
    size: Number,
    path: String
  }],
  // For received emails
  date: {
    type: Date,
    default: Date.now
  },
  // For sent emails
  sentAt: {
    type: Date,
    default: Date.now
  },
  // Status for sent emails
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'delivered'],
    default: 'pending'
  },
  error: String,
  // Reference to related entities
  relatedTo: {
    type: String,
    enum: ['contact', 'order', 'user', 'application', 'other'],
    default: 'other'
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  },
  // Labels/folders
  labels: [{
    type: String
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  isArchived: {
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

EmailSchema.index({ direction: 1, date: -1 })
EmailSchema.index({ 'to.address': 1 })
EmailSchema.index({ 'from.address': 1 })
EmailSchema.index({ subject: 'text', text: 'text', html: 'text' })

export default mongoose.models.Email || mongoose.model('Email', EmailSchema)


