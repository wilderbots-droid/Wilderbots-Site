import mongoose from 'mongoose'

const SMTPConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  host: {
    type: String,
    required: true,
    trim: true
  },
  port: {
    type: Number,
    required: true,
    default: 587
  },
  secure: {
    type: Boolean,
    default: false // true for 465, false for other ports
  },
  auth: {
    user: {
      type: String,
      required: true,
      trim: true
    },
    pass: {
      type: String,
      required: true
    }
  },
  from: {
    name: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  // IMAP settings for receiving emails
  imap: {
    host: {
      type: String,
      trim: true
    },
    port: {
      type: Number,
      default: 993
    },
    secure: {
      type: Boolean,
      default: true
    },
    auth: {
      user: {
        type: String,
        trim: true
      },
      pass: {
        type: String
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
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

// Ensure only one default config exists
SMTPConfigSchema.pre('save', async function() {
  if (this.isDefault && this.isModified('isDefault')) {
    await mongoose.model('SMTPConfig').updateMany(
      { _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    )
  }
  this.updatedAt = Date.now()
})

export default mongoose.models.SMTPConfig || mongoose.model('SMTPConfig', SMTPConfigSchema)


