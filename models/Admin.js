import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

AdminSchema.pre('save', async function() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})


AdminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

if (mongoose.models.Admin) {
  delete mongoose.models.Admin
}
export default mongoose.model('Admin', AdminSchema)


