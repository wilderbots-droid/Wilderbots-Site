import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    edition: {
      type: String,
      default: 'Development Kit Edition'
    },
    engineeredBy: {
      type: String,
      default: 'Engineered by <br/>You.'
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Product || mongoose.model('Product', productSchema)
