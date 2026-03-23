const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://admin:admin123@cluster0.p7y6a.mongodb.net/wilderbots?retryWrites=true&w=majority"

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    const ps = await Product.find();
    console.log('Product Count:', ps.length);
    ps.forEach(p => {
      console.log('---');
      console.log('Title:', p.title);
      console.log('Features:', JSON.stringify(p.features, null, 2));
      console.log('Overview Content:', p.detailedOverview ? 'Present' : 'Missing');
    });
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

check();
