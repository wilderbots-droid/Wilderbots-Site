import mongoose from 'mongoose'

const ProcessStepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'CheckCircle'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: true
})

export default mongoose.models.ProcessStep || mongoose.model('ProcessStep', ProcessStepSchema)
