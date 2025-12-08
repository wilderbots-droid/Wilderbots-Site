import mongoose from 'mongoose'

const JobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  careerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
    required: false,
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
  phone: {
    type: String
  },
  position: {
    type: String,
    required: true
  },
  resume: {
    type: String // URL or file path
  },
  coverLetter: {
    type: String
  },
  portfolio: {
    type: String
  },
  linkedin: {
    type: String
  },
  github: {
    type: String
  },
  experience: {
    type: String
  },
  whyWilderbots: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'interviewing', 'accepted', 'rejected'],
    default: 'pending'
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

// NO PRE-SAVE HOOKS - updatedAt is set manually in the API
// Explicitly ensure no hooks are registered

// Completely remove any existing model and schema to avoid caching
if (mongoose.models.JobApplication) {
  mongoose.deleteModel('JobApplication')
}
if (mongoose.modelSchemas && mongoose.modelSchemas.JobApplication) {
  delete mongoose.modelSchemas.JobApplication
}

// Create fresh model without any hooks
const JobApplication = mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema)

export default JobApplication
