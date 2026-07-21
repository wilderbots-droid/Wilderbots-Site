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
      default: 'Standard Edition'
    },
    engineeredBy: {
      type: String,
      default: 'Wilderbots'
    },
    description: {
      type: String,
      required: true
    },
    detailedOverview: {
      type: String
    },
    features: [
      {
        title: String,
        description: String,
        icon: String
      }
    ],
    image: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    ctaText: {
      type: String,
      default: 'Learn More'
    },
    ctaLink: {
      type: String
    },
    appStoreLink: {
      type: String
    },
    playStoreLink: {
      type: String
    },
    showCta: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Product || mongoose.model('Product', productSchema)
