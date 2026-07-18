import mongoose from 'mongoose'

const EducationContentSchema = new mongoose.Schema({
  badgeText: { type: String, default: 'Education Sector' },
  title: { type: String, default: 'Learn like Never Before.' },
  titleGradient: { type: String, default: 'Never Before.' },
  description: { type: String, default: "We build learning experiences that make advanced technology easier to understand, teach, and apply." },
  features: [{
    icon: { type: String, default: 'Aperture' },
    text: { type: String, default: 'Interactive AI-driven modules' }
  }],
  ctaText: { type: String, default: 'Visit Neureck.com' },
  ctaLink: { type: String, default: 'https://neureck.com' },
  ctaSubtext: { type: String, default: 'Leaves Wilderbots to open our partner platform.' },
  browserUrl: { type: String, default: 'neureck.com' },
  browserImage: { type: String, default: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1974&auto=format&fit=crop' },
  trendingTitle: { type: String, default: 'Now Trending' },
  trendingSubtitle: { type: String, default: 'Introduction to Neural Networks' },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Correct way to export for Next.js/Mongoose
export default mongoose.models.EducationContent || mongoose.model('EducationContent', EducationContentSchema)
