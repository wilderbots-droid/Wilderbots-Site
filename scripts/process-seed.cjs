const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://wilderbots_db_user:8JBo8irTcBbRFAMB@wilderbotssite.lwn8esy.mongodb.net/wilderbots_db?retryWrites=true&w=majority";

const ProcessStepSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: String,
  order: Number,
  isActive: Boolean
}, { timestamps: true });

const CompanyInfoSchema = new mongoose.Schema({
  processSection: {
    title: String,
    badgeText: String
  }
}, { strict: false });

const ProcessStep = mongoose.models.ProcessStep || mongoose.model('ProcessStep', ProcessStepSchema);
const CompanyInfo = mongoose.models.CompanyInfo || mongoose.model('CompanyInfo', CompanyInfoSchema);

async function seed() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // 1. Update CompanyInfo metadata
    console.log('Updating CompanyInfo metadata...');
    let companyInfo = await CompanyInfo.findOne();
    if (!companyInfo) {
      companyInfo = new CompanyInfo({
        name: 'Wilderbots',
        email: 'hello@wilderbots.com'
      });
    }
    companyInfo.processSection = {
      title: 'Our Journey.',
      badgeText: 'Wilderbots Process'
    };
    await companyInfo.save();
    console.log('CompanyInfo updated.');

    // 2. Seed Process Steps
    console.log('Clearing old process steps...');
    await ProcessStep.deleteMany({});

    const steps = [
      {
        title: "Consult & Strategize",
        description: "We partner with you to understand your unique challenges. Our experts map out a tailored strategy that leverages AI and software delivery to drive your vision forward.",
        icon: "Layers",
        order: 1,
        isActive: true
      },
      {
        title: "Design & Engineer",
        description: "Precision meets creativity. We architect robust solutions, from scalable software platforms to advanced AI models, ensuring every system is optimized for performance.",
        icon: "Wrench",
        order: 2,
        isActive: true
      },
      {
        title: "Deploy & Support",
        description: "We bring your solution to life and stay by your side. Our continuous integration and dedicated support ensure your tech evolves with your growing needs.",
        icon: "CheckCircle",
        order: 3,
        isActive: true
      }
    ];

    console.log('Inserting new process steps...');
    await ProcessStep.insertMany(steps);
    console.log('Steps seeded successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
