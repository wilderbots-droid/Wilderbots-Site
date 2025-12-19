import mongoose from 'mongoose'

const AvatarSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    type: Buffer,
    required: true
  },
  contentType: {
    type: String,
    required: true,
    default: 'image/jpeg'
  },
  size: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Avatar || mongoose.model('Avatar', AvatarSchema)
