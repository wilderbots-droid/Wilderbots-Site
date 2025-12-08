import mongoose from 'mongoose'

const MaintenanceSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'We are currently performing scheduled maintenance. We will be back shortly!'
  },
  endTime: {
    type: Date,
    default: null
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Ensure only one document exists
MaintenanceSchema.statics.getMaintenance = async function() {
  let maintenance = await this.findOne()
  if (!maintenance) {
    maintenance = await this.create({
      isActive: false,
      message: 'We are currently performing scheduled maintenance. We will be back shortly!',
      endTime: null
    })
  }
  return maintenance
}

export default mongoose.models.Maintenance || mongoose.model('Maintenance', MaintenanceSchema)
