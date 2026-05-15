const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://wilderbots_db_user:8JBo8irTcBbRFAMB@wilderbotssite.lwn8esy.mongodb.net/wilderbots_db?retryWrites=true&w=majority"

// Define schema with strict: false to ensure all fields are saved
const productSchema = new mongoose.Schema({}, { strict: false, collection: 'products' });

// Try to get existing or create new
let Product;
try {
  Product = mongoose.model('ProductSeed', productSchema);
} catch (e) {
  Product = mongoose.model('ProductSeed');
}

async function seed() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // We use the 'products' collection explicitly
    const collection = mongoose.connection.collection('products');
    
    console.log('Clearing collection...');
    await collection.deleteMany({});

    const products = [
      {
        title: "Wilder Watch Dev Kit",
        subtitle: "The world's most hackable wearable. You don't just buy it. You build it.",
        edition: "Development Kit Edition",
        engineeredBy: "Engineered by You.",
        description: "A modular, open-source smartwatch kit designed for students, hackers, and creators. Assemble the hardware and code your own OS.",
        detailedOverview: "The Wilder Watch arrives as a modular kit. Follow our interactive guides to assemble the PCB, display, and battery. Then, flash your own code or use our open-source OS to customize every watch face, gesture, and AI feature.\n\nPowered by the W1-Dev chip, it gives you raw access to every sensor, allowing you to build everything from custom health trackers to edge AI applications.",
        features: [
          { title: "Hackable Core", description: "W1-Dev chip with dual-core AI acceleration and raw sensor access.", icon: "Cpu" },
          { title: "Open Source OS", description: "Built on OpenRTOS. Complete control over every pixel and process.", icon: "Terminal" },
          { title: "Modular Design", description: "Replaceable IPS display, LiPo battery, and standard 22mm straps.", icon: "Box" },
          { title: "AI Companion", description: "Local AI processing for voice notes, mood tracking, and meeting summaries.", icon: "Zap" }
        ],
        price: 299,
        image: "/kit.png",
        isActive: true,
        isPrimary: true,
        ctaText: "Get Your Kit",
        ctaLink: "",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Liquid Bottle Tracker",
        subtitle: "Modernizing Nightlife with Digital Bottle Wallets.",
        edition: "Platform Edition",
        engineeredBy: "By Wilderbots",
        description: "A premium nightlife platform that streamlines the experience of managing and enjoying spirits. No more physical tags or lost bottles.",
        detailedOverview: "Liquid Bottle Tracker is a premium nightlife platform that streamlines the experience of managing and enjoying spirits. Our app bridges the gap between traditional venue management and the modern, digital-first consumer, offering a \"Digital Bottle Wallet\" that transforms how you experience your favorite bars.\n\nFrom real-time pour alerts to VIP sharing, LBT ensures your premium spirits are safe, shared, and enjoyed exactly how you want.",
        features: [
          { title: "Digital Wallet", description: "Securely store your premium spirits in your digital wallet. Access anywhere.", icon: "SmartphoneNfc" },
          { title: "VIP Sharing", description: "Invite friends to share your bottle digitally with one-tap guest lists.", icon: "UserCheck" },
          { title: "Real-time Alerts", description: "Get notified on your phone every time a pour is requested or served.", icon: "Zap" },
          { title: "Bar ERM", description: "Empowering venues with inventory tracking and customer insights.", icon: "BarChart3" }
        ],
        price: 3500,
        image: "/bottle_tracker_ui_mockup.png",
        isActive: true,
        isPrimary: false,
        ctaText: "Join the Club",
        ctaLink: "",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "ValueShift",
        subtitle: "Empowering car owners with AI-driven trust.",
        edition: "Mobile App Edition",
        engineeredBy: "By ValueShift",
        description: "Buy and sell verified pre-owned vehicles with confidence. We bridge the gap between uncertainty and trust through data transparency and expert companionship.",
        detailedOverview: "The smartest way to buy and sell pre-owned vehicles.\n\nOur AI-powered tool scans your car's details and condition through simple photos you upload. We generate a professional listing, provide full legal support for RTO transfers, and connect you with verified buyers to close the deal securely.",
        features: [
          { title: "AI-Powered Scanning", description: "Scan your car's details and condition instantly through simple photos.", icon: "Smartphone" },
          { title: "Honest Valuations", description: "Get instant valuations based on real-time market data and local demand.", icon: "BarChart3" },
          { title: "Expert Inspections", description: "150+ point technical inspections by certified mechanics.", icon: "Wrench" },
          { title: "RTO Legal Support", description: "Full legal support for RTO transfers and secure ownership transition.", icon: "ShieldCheck" }
        ],
        price: 0,
        showPrice: false,
        image: "/valueshift-vehicle.png",
        isActive: true,
        isPrimary: false,
        ctaText: "Visit ValueShift.in",
        ctaLink: "https://valueshift.in",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log('Inserting products...');
    await collection.insertMany(products);
    console.log('Seeded successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
