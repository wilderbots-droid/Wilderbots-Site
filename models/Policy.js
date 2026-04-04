import mongoose from 'mongoose'

const PolicySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['privacy', 'terms', 'returns'],
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

PolicySchema.pre('save', async function() {
  this.updatedAt = Date.now()
  this.lastUpdated = Date.now()
})



export default mongoose.models.Policy || mongoose.model('Policy', PolicySchema)

