const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://wilderbots_db_user:8JBo8irTcBbRFAMB@wilderbotssite.lwn8esy.mongodb.net/wilderbots_db?retryWrites=true&w=majority";

const StatSchema = new mongoose.Schema({
  value: String,
  label: String,
  order: Number,
  isActive: Boolean
}, { timestamps: true });

const Stat = mongoose.models.Stat || mongoose.model('Stat', StatSchema);

async function seed() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    console.log('Clearing old stats...');
    await Stat.deleteMany({});

    const stats = [
      {
        value: "50k+",
        label: "Kits Shipped",
        order: 1,
        isActive: true
      },
      {
        value: "10k+",
        label: "GitHub Stars",
        order: 2,
        isActive: true
      },
      {
        value: "35",
        label: "Countries",
        order: 3,
        isActive: true
      },
      {
        value: "100+",
        label: "Universities",
        order: 4,
        isActive: true
      }
    ];

    console.log('Inserting new stats...');
    await Stat.insertMany(stats);
    console.log('Stats seeded successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
