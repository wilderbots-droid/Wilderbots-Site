const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://wilderbots_db_user:8JBo8irTcBbRFAMB@wilderbotssite.lwn8esy.mongodb.net/wilderbots_db?retryWrites=true&w=majority";

const EducationContentSchema = new mongoose.Schema({
  badgeText: String,
  title: String,
  titleGradient: String,
  description: String,
  features: [{
    icon: String,
    text: String
  }],
  ctaText: String,
  ctaLink: String,
  ctaSubtext: String,
  browserUrl: String,
  browserImage: String,
  trendingTitle: String,
  trendingSubtitle: String
}, { timestamps: true });

const EducationContent = mongoose.models.EducationContent || mongoose.model('EducationContent', EducationContentSchema);

async function seed() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    console.log('Clearing old education content...');
    await EducationContent.deleteMany({});

    const content = {
      badgeText: 'Education Sector',
      title: 'Learn like Never Before.',
      titleGradient: 'Never Before.',
      description: "We build learning experiences that make advanced technology easier to understand, teach, and apply.",
      features: [
        { icon: 'Aperture', text: 'Interactive AI-driven modules' },
        { icon: 'Globe', text: 'Global community of learners' }
      ],
      ctaText: 'Visit Neureck.com',
      ctaLink: 'https://neureck.com',
      ctaSubtext: 'Leaves Wilderbots to open our partner platform.',
      browserUrl: 'neureck.com',
      browserImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1974&auto=format&fit=crop',
      trendingTitle: 'Now Trending',
      trendingSubtitle: 'Introduction to Neural Networks'
    };

    console.log('Inserting new education content...');
    await EducationContent.create(content);
    console.log('Education content seeded successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
