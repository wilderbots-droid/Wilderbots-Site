/**
 * Script to seed MongoDB with static data from the main site
 * Run with: node scripts/seed-data.js
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import connectDB from '../lib/mongodb.js'

// Schemas
const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Package' },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const CareerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const CompanyInfoSchema = new mongoose.Schema({
  name: { type: String, default: 'Wilderbots' },
  email: { type: String, default: 'hello@wilderbots.com' },
  phone: { type: String, default: '+1 (555) 123-4567' },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  businessHours: { type: String, default: 'Monday - Friday: 9:00 AM - 6:00 PM' },
  timezone: { type: String, default: 'Pacific Standard Time' },
  departments: [{
    title: String,
    email: String,
    description: String
  }],
  socialMedia: {
    linkedin: String,
    github: String,
    twitter: String
  },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true })

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const ReviewSchema = new mongoose.Schema({
  quote: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  avatar: { type: String, default: 'https://i.pravatar.cc/150' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  category: { type: String, enum: ['Product', 'Service', 'Education', 'General'], default: 'General' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  avatar: { type: String, default: 'https://i.pravatar.cc/150' },
  social: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    email: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const PolicySchema = new mongoose.Schema({
  type: { type: String, enum: ['privacy', 'terms', 'returns'], required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true })

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema)
const Career = mongoose.models.Career || mongoose.model('Career', CareerSchema)
const CompanyInfo = mongoose.models.CompanyInfo || mongoose.model('CompanyInfo', CompanyInfoSchema)
const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema)
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema)
const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema)
const Policy = mongoose.models.Policy || mongoose.model('Policy', PolicySchema)

async function seedData() {
  try {
    await connectDB()
    console.log('Connected to MongoDB\n')

    // Seed Services
    console.log('Seeding Services...')
    const services = [
      {
        title: 'Application Development',
        description: 'Native and cross-platform mobile experiences that feel fluid, intuitive, and engaging. We build the apps Gen Z actually wants to use.',
        icon: 'Smartphone',
        features: ['iOS Development', 'Android Development', 'Cross-Platform Apps', 'Native Mobile Solutions'],
        isActive: true,
        order: 1
      },
      {
        title: 'Web Development',
        description: 'Futuristic, responsive, and scalable web platforms. From landing pages to complex SaaS applications, we code the web of tomorrow.',
        icon: 'Globe',
        features: ['Web Applications', 'Website Development', 'Progressive Web Apps (PWA)', 'E-commerce Solutions'],
        isActive: true,
        order: 2
      },
      {
        title: 'Software Development',
        description: 'Desktop applications, cloud solutions, and enterprise software built for scale and performance.',
        icon: 'Monitor',
        features: ['Desktop Applications', 'Cloud Solutions', 'Enterprise Software', 'API Development'],
        isActive: true,
        order: 3
      },
      {
        title: 'AI & Machine Learning',
        description: 'Integrating intelligence into your workflow. Custom LLMs, predictive analytics, and automation bots that give your business a brain.',
        icon: 'Bot',
        features: ['LLM Finetuning', 'Custom AI Models', 'NLP Solutions', 'Continued Pre-Training', 'Agent Chatbot Development', 'Multi Modal Agents', 'Speech Recognition Systems'],
        isActive: true,
        order: 4
      },
      {
        title: 'Computer Vision',
        description: 'Advanced image processing and analysis solutions powered by cutting-edge computer vision technology.',
        icon: 'Eye',
        features: ['Image Processing', 'Image Analysis', 'Object Detection', 'Facial Recognition'],
        isActive: true,
        order: 5
      },
      {
        title: 'Design Services',
        description: 'Beautiful, intuitive interfaces and brand identities that resonate with your audience.',
        icon: 'Palette',
        features: ['UI/UX Designing', 'UI/UX Prototyping', 'Graphics Designing', 'Brand Identity Design'],
        isActive: true,
        order: 6
      },
      {
        title: 'Data Services',
        description: 'Transform your data into actionable insights with advanced analytics and visualization.',
        icon: 'BarChart3',
        features: ['Data Analysis & Insights', 'Business Intelligence', 'Data Visualization', 'Predictive Analytics'],
        isActive: true,
        order: 7
      },
      {
        title: '3D & Immersive Tech',
        description: 'Create immersive experiences with cutting-edge 3D and AR/VR technologies.',
        icon: 'Box',
        features: ['3D Projects', 'AR/VR Projects', '3D Modeling', 'Virtual Environments'],
        isActive: true,
        order: 8
      },
      {
        title: 'Media Production',
        description: 'Professional video production, editing, and post-production services.',
        icon: 'Video',
        features: ['Video Editing', 'Motion Graphics', 'Video Production', 'Post-Production'],
        isActive: true,
        order: 9
      },
      {
        title: 'Digital Marketing',
        description: 'Boost your online presence with strategic digital marketing and analytics.',
        icon: 'Megaphone',
        features: ['SEO & SEM', 'Social Media Marketing', 'Content Marketing', 'Marketing Analytics'],
        isActive: true,
        order: 10
      }
    ]

    for (const serviceData of services) {
      const existing = await Service.findOne({ title: serviceData.title })
      if (!existing) {
        await Service.create(serviceData)
        console.log(`  ✓ Created service: ${serviceData.title}`)
      } else {
        console.log(`  - Service already exists: ${serviceData.title}`)
      }
    }

    // Seed Careers
    console.log('\nSeeding Careers...')
    const careers = [
      {
        title: 'Senior Full-Stack Developer',
        department: 'Engineering',
        type: 'Full-time',
        location: 'Remote / Hybrid',
        description: 'Build cutting-edge web and mobile applications using Next.js, React Native, and modern cloud technologies.',
        requirements: ['5+ years experience', 'React/Next.js expertise', 'Cloud architecture', 'Team leadership'],
        isActive: true
      },
      {
        title: 'AI/ML Engineer',
        department: 'Engineering',
        type: 'Full-time',
        location: 'Remote / Hybrid',
        description: 'Develop and fine-tune LLM models, build custom AI solutions, and create intelligent systems for our clients.',
        requirements: ['3+ years ML experience', 'Python/TensorFlow', 'LLM expertise', 'NLP knowledge'],
        isActive: true
      },
      {
        title: 'Mobile App Developer (iOS/Android)',
        department: 'Engineering',
        type: 'Full-time',
        location: 'Remote',
        description: 'Create beautiful, performant mobile applications for iOS and Android platforms.',
        requirements: ['3+ years mobile dev', 'Swift/Kotlin', 'React Native', 'App Store experience'],
        isActive: true
      },
      {
        title: 'UI/UX Designer',
        department: 'Design',
        type: 'Full-time',
        location: 'Remote / Hybrid',
        description: 'Design intuitive, beautiful interfaces for web, mobile, and wearable devices.',
        requirements: ['4+ years design experience', 'Figma expertise', 'Portfolio required', 'User research'],
        isActive: true
      },
      {
        title: 'Education Content Creator',
        department: 'Education',
        type: 'Full-time',
        location: 'Remote',
        description: 'Create engaging educational content, tutorials, and courses for the Neureck platform.',
        requirements: ['STEM background', 'Content creation', 'Video editing', 'Teaching experience'],
        isActive: true
      },
      {
        title: 'Business Development Manager',
        department: 'Business',
        type: 'Full-time',
        location: 'Remote / Hybrid',
        description: 'Build partnerships, expand our client base, and drive growth for our IT services division.',
        requirements: ['3+ years B2B sales', 'Tech industry experience', 'Relationship building', 'Results-driven'],
        isActive: true
      }
    ]

    for (const careerData of careers) {
      const existing = await Career.findOne({ title: careerData.title })
      if (!existing) {
        await Career.create(careerData)
        console.log(`  ✓ Created career: ${careerData.title}`)
      } else {
        console.log(`  - Career already exists: ${careerData.title}`)
      }
    }

    // Seed FAQs
    console.log('\nSeeding FAQs...')
    const faqs = [
      // Product Questions
      { question: "Is the Wilder Watch Dev Kit pre-assembled?", answer: "No, it ships as a DIY kit. We believe the best way to understand technology is to build it. A detailed 3D interactive guide makes assembly easy for everyone—no soldering required. The kit includes all necessary components: PCB, display, sensors, battery, and chassis.", category: "Product", order: 1 },
      { question: "What programming languages does the Wilder Watch support?", answer: "The Wilder Watch natively supports MicroPython and C++ (Arduino/ESP-IDF). It's perfect for both beginners learning embedded programming and advanced developers building custom applications. The device also supports our open-source OS with pre-built watch faces and features.", category: "Product", order: 2 },
      { question: "Can I use the Wilder Watch as a regular smartwatch?", answer: "Absolutely! Once assembled and flashed with our default OS, it functions as a fully-featured smartwatch with notifications, health tracking, timekeeping, and connectivity features. You can also customize it with your own code or choose from our community-created watch faces.", category: "Product", order: 3 },
      { question: "What's included in the Dev Kit?", answer: "The complete kit includes: ESP32-S3 microcontroller, 1.69\" IPS LCD touchscreen, 350mAh LiPo battery, modular PCB with all sensors, chassis components, USB-C cable for programming, and comprehensive assembly guide. Everything you need to build your watch is included.", category: "Product", order: 4 },
      { question: "Is the Wilder Watch open source?", answer: "Yes! Our firmware, hardware designs, and software are open source. You can find our code on GitHub, modify it, and contribute to the community. We encourage makers to share their custom watch faces, health algorithms, and projects with the community.", category: "Product", order: 5 },
      // Ordering & Shipping
      { question: "How long does shipping take?", answer: "Orders are processed immediately, but due to high demand and quality assurance checks, shipping commences 10 business days after order confirmation. We ship to over 35 countries worldwide. International shipping typically takes 5-10 additional business days depending on your location.", category: "Ordering & Shipping", order: 1 },
      { question: "Do you accept Cash on Delivery (COD)?", answer: "No, we require full pre-payment for all Development Kit orders. This ensures we can secure your hardware allocation and maintain our quality standards. We accept all major credit and debit cards through our secure checkout process.", category: "Ordering & Shipping", order: 2 },
      { question: "What is the price of the Wilder Watch Dev Kit?", answer: "The Wilder Watch Dev Kit is priced at $299.00. This includes all components, assembly guide, and access to our open-source firmware. Shipping costs may vary by location and will be calculated at checkout.", category: "Ordering & Shipping", order: 3 },
      { question: "Do you ship internationally?", answer: "Yes, we ship to over 35 countries worldwide. Shipping times vary by location but typically range from 5-10 business days after the 10-day processing period. You can check shipping availability and costs during checkout.", category: "Ordering & Shipping", order: 4 },
      // IT Services
      { question: "What IT services does Wilderbots offer?", answer: "We offer comprehensive IT services including: Application Development (iOS & Android), Web Development, Software Development (Desktop & Cloud), AI & Machine Learning (LLM Finetuning, Custom AI Models, Chatbots), Computer Vision, UI/UX Design, Data Analysis, 3D/AR/VR Projects, Video Editing, and Digital Marketing. Visit our Services page for complete details.", category: "IT Services", order: 1 },
      { question: "How do I get started with your IT services?", answer: "Simply contact us through our Contact page or email business@wilderbots.com. Our team will schedule a consultation to understand your needs and provide a customized proposal. We work with businesses of all sizes, from startups to enterprises.", category: "IT Services", order: 2 },
      { question: "Do you provide AI and machine learning services?", answer: "Yes! We specialize in AI solutions including LLM finetuning, custom AI model development, NLP solutions, continued pre-training, agent chatbot development, multi-modal agents, and speech recognition systems. Our team has extensive experience in deploying AI solutions for various industries.", category: "IT Services", order: 3 },
      // Education & Neureck
      { question: "What is Neureck?", answer: "Neureck is our dedicated educational platform that revolutionizes STEM learning. It features interactive AI-driven modules, hands-on projects, and a global community of learners. Neureck makes complex technology concepts accessible and engaging for students, educators, and professionals.", category: "Education & Neureck", order: 1 },
      { question: "Can I access Neureck without buying the Wilder Watch?", answer: "Absolutely! Neureck is a standalone web platform accessible from any browser at neureck.com. While owning a Wilder Watch unlocks exclusive biometric learning data and hands-on projects, the platform itself is free to explore and use.", category: "Education & Neureck", order: 2 },
      { question: "Is Neureck suitable for schools and universities?", answer: "Yes! Neureck is designed for educational institutions. We offer special programs for schools and universities, including curriculum integration, teacher training, and bulk licensing options. Contact education@wilderbots.com for institutional partnerships.", category: "Education & Neureck", order: 3 },
      // Technical Support
      { question: "What technical support do you provide?", answer: "We provide comprehensive support through multiple channels: email support (support@wilderbots.com), detailed documentation, GitHub community forums, and video tutorials. For IT services clients, we offer dedicated support packages tailored to your needs.", category: "Technical Support", order: 1 },
      { question: "What are the technical specifications of the Wilder Watch?", answer: "The Dev Kit features: ESP32-S3 Dual Core microcontroller with AI acceleration, 1.69\" IPS LCD touchscreen, 350mAh LiPo battery (user replaceable), modular PCB design fitting 22mm straps, USB-C debugging, OTA update support, and I2C/UART/SPI expansion pads for custom sensors.", category: "Technical Support", order: 2 },
      // Company
      { question: "What type of company is Wilderbots?", answer: "Wilderbots operates as three integrated businesses: a Product Company (designing and manufacturing the Wilder Watch Dev Kit), a Service Company (providing comprehensive IT services), and an Ed-Tech Company (through the Neureck platform). We're uniquely positioned at the intersection of hardware, software, and education.", category: "Company", order: 1 },
      { question: "How can I stay updated on new products and features?", answer: "Subscribe to our newsletter on the homepage, follow us on social media (LinkedIn, GitHub, Twitter), or join our community on GitHub. We regularly announce new features, firmware updates, and educational content through these channels.", category: "Company", order: 2 }
    ]

    for (const faqData of faqs) {
      const existing = await FAQ.findOne({ question: faqData.question })
      if (!existing) {
        await FAQ.create(faqData)
        console.log(`  ✓ Created FAQ: ${faqData.question.substring(0, 50)}...`)
      } else {
        console.log(`  - FAQ already exists: ${faqData.question.substring(0, 50)}...`)
      }
    }

    // Seed Reviews
    console.log('\nSeeding Reviews...')
    const reviews = [
      {
        quote: "Building my own watch felt like magic. I programmed it to unlock my smart door lock. Best weekend project ever.",
        name: "Alex R.",
        role: "Maker & Student",
        avatar: "https://i.pravatar.cc/150?img=11",
        rating: 5,
        category: "Product",
        order: 1
      },
      {
        quote: "I use the Neureck platform for my university courses. It's the most engaging way to learn complex tech subjects.",
        name: "Sarah K.",
        role: "Computer Science Student",
        avatar: "https://i.pravatar.cc/150?img=5",
        rating: 5,
        category: "Education",
        order: 2
      },
      {
        quote: "The open API allowed our research team to collect raw accelerometer data for our gait analysis study. Invaluable tool.",
        name: "Dr. David L.",
        role: "Research Scientist",
        avatar: "https://i.pravatar.cc/150?img=33",
        rating: 5,
        category: "Product",
        order: 3
      },
      {
        quote: "The Wilder Watch is a game-changer for my training. The data accuracy is incredible, and it looks stunning.",
        name: "Alex R.",
        role: "Pro Athlete",
        avatar: "https://i.pravatar.cc/150?img=11",
        rating: 5,
        category: "Product",
        order: 4
      },
      {
        quote: "Wilderbots built our company's mobile app, and the results exceeded our expectations. Flawless execution.",
        name: "David L.",
        role: "CEO, TechStart",
        avatar: "https://i.pravatar.cc/150?img=33",
        rating: 5,
        category: "Service",
        order: 5
      }
    ]

    for (const reviewData of reviews) {
      const existing = await Review.findOne({ quote: reviewData.quote })
      if (!existing) {
        await Review.create(reviewData)
        console.log(`  ✓ Created review: ${reviewData.name}`)
      } else {
        console.log(`  - Review already exists: ${reviewData.name}`)
      }
    }

    // Seed Team Members
    console.log('\nSeeding Team Members...')
    const teamMembers = [
      {
        name: 'Alex Chen',
        role: 'CEO & Co-Founder',
        bio: 'Former hardware engineer at leading tech companies. Passionate about making technology accessible through education.',
        avatar: 'https://i.pravatar.cc/150?img=12',
        social: {
          linkedin: 'https://linkedin.com',
          github: 'https://github.com',
          email: 'alex@wilderbots.com',
          twitter: ''
        },
        order: 1
      },
      {
        name: 'Sarah Martinez',
        role: 'CTO & Co-Founder',
        bio: 'Embedded systems expert with 10+ years in wearable tech. Led development of the W1 chip architecture.',
        avatar: 'https://i.pravatar.cc/150?img=5',
        social: {
          linkedin: 'https://linkedin.com',
          github: 'https://github.com',
          email: 'sarah@wilderbots.com',
          twitter: ''
        },
        order: 2
      },
      {
        name: 'David Kim',
        role: 'Head of Education',
        bio: 'Former university professor turned ed-tech innovator. Created the Neureck platform to revolutionize STEM learning.',
        avatar: 'https://i.pravatar.cc/150?img=33',
        social: {
          linkedin: 'https://linkedin.com',
          github: 'https://github.com',
          email: 'david@wilderbots.com',
          twitter: ''
        },
        order: 3
      },
      {
        name: 'Emma Wilson',
        role: 'Lead Product Designer',
        bio: 'Industrial designer specializing in wearable devices. Designs products that feel as good as they function.',
        avatar: 'https://i.pravatar.cc/150?img=47',
        social: {
          linkedin: 'https://linkedin.com',
          github: 'https://github.com',
          email: 'emma@wilderbots.com',
          twitter: ''
        },
        order: 4
      },
      {
        name: 'Michael Torres',
        role: 'Head of Engineering',
        bio: 'Full-stack developer and open-source advocate. Maintains the Wilder Watch firmware and developer tools.',
        avatar: 'https://i.pravatar.cc/150?img=15',
        social: {
          linkedin: 'https://linkedin.com',
          github: 'https://github.com',
          email: 'michael@wilderbots.com',
          twitter: ''
        },
        order: 5
      },
      {
        name: 'Priya Patel',
        role: 'Head of Operations',
        bio: 'Supply chain and logistics expert. Ensures every kit reaches our community on time, every time.',
        avatar: 'https://i.pravatar.cc/150?img=20',
        social: {
          linkedin: 'https://linkedin.com',
          github: 'https://github.com',
          email: 'priya@wilderbots.com',
          twitter: ''
        },
        order: 6
      }
    ]

    for (const memberData of teamMembers) {
      const existing = await TeamMember.findOne({ name: memberData.name, role: memberData.role })
      if (!existing) {
        await TeamMember.create(memberData)
        console.log(`  ✓ Created team member: ${memberData.name}`)
      } else {
        console.log(`  - Team member already exists: ${memberData.name}`)
      }
    }

    // Seed Company Info
    console.log('\nSeeding Company Info...')
    let companyInfo = await CompanyInfo.findOne()
    if (!companyInfo) {
      companyInfo = await CompanyInfo.create({
        name: 'Wilderbots',
        email: 'hello@wilderbots.com',
        phone: '+1 (555) 123-4567',
        address: {
          street: '123 Innovation Drive',
          city: 'Tech Valley',
          state: 'CA',
          zipCode: '94025',
          country: 'USA'
        },
        businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM',
        timezone: 'Pacific Standard Time',
        departments: [
          {
            title: 'Product Support',
            email: 'support@wilderbots.com',
            description: 'Questions about the Wilder Watch Dev Kit, shipping, or technical support'
          },
          {
            title: 'Business & Services',
            email: 'business@wilderbots.com',
            description: 'IT services, partnerships, enterprise solutions, and B2B inquiries'
          },
          {
            title: 'Education & Neureck',
            email: 'education@wilderbots.com',
            description: 'Neureck platform, educational partnerships, curriculum inquiries'
          },
          {
            title: 'General Inquiries',
            email: 'hello@wilderbots.com',
            description: 'Press, media, careers, or any other questions'
          }
        ],
        socialMedia: {
          linkedin: '',
          github: '',
          twitter: ''
        }
      })
      console.log('  ✓ Created company info')
    } else {
      console.log('  - Company info already exists')
    }

    // Seed Policies
    console.log('\nSeeding Policies...')
    const policies = [
      {
        type: 'privacy',
        title: 'Privacy Policy',
        content: `<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">1. Introduction</h2>
  <p class="text-gray-300 leading-relaxed">
    Welcome to Wilderbots ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our products and services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our products, or interact with our services.
  </p>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
  <h3 class="text-xl font-semibold text-white mb-3 mt-6">2.1 Personal Information</h3>
  <p class="text-gray-300 leading-relaxed">We may collect personal information that you voluntarily provide to us when you:</p>
  <ul class="list-disc pl-6 space-y-2 mt-3 text-gray-300">
    <li>Register for an account on our website</li>
    <li>Subscribe to our newsletter</li>
    <li>Place an order for our products</li>
    <li>Contact us through our contact form</li>
    <li>Apply for a job position</li>
    <li>Participate in surveys or promotions</li>
  </ul>
  <p class="mt-4 text-gray-300 leading-relaxed">This information may include:</p>
  <ul class="list-disc pl-6 space-y-2 mt-3 text-gray-300">
    <li>Name and contact information (email address, phone number, mailing address)</li>
    <li>Payment information (credit card details, billing address)</li>
    <li>Account credentials (username, password)</li>
    <li>Resume and job application materials</li>
    <li>Any other information you choose to provide</li>
  </ul>

  <h3 class="text-xl font-semibold text-white mb-3 mt-6">2.2 Automatically Collected Information</h3>
  <p class="text-gray-300 leading-relaxed">When you visit our website, we automatically collect certain information about your device and browsing behavior, including:</p>
  <ul class="list-disc pl-6 space-y-2 mt-3 text-gray-300">
    <li>IP address and location data</li>
    <li>Browser type and version</li>
    <li>Operating system</li>
    <li>Pages visited and time spent on pages</li>
    <li>Referring website addresses</li>
    <li>Device identifiers</li>
  </ul>

  <h3 class="text-xl font-semibold text-white mb-3 mt-6">2.3 Cookies and Tracking Technologies</h3>
  <p class="text-gray-300 leading-relaxed">
    We use cookies, web beacons, and similar tracking technologies to collect and store information about your preferences and browsing behavior. You can control cookie preferences through your browser settings.
  </p>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
  <p class="text-gray-300 leading-relaxed">We use the information we collect for various purposes, including:</p>
  <ul class="list-disc pl-6 space-y-2 mt-3 text-gray-300">
    <li>Processing and fulfilling your orders</li>
    <li>Managing your account and providing customer support</li>
    <li>Sending you newsletters, marketing communications, and promotional materials (with your consent)</li>
    <li>Responding to your inquiries and requests</li>
    <li>Processing job applications</li>
    <li>Improving our website, products, and services</li>
    <li>Analyzing usage patterns and trends</li>
    <li>Preventing fraud and ensuring security</li>
    <li>Complying with legal obligations</li>
  </ul>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">4. Information Sharing and Disclosure</h2>
  <p class="text-gray-300 leading-relaxed">We do not sell your personal information. We may share your information in the following circumstances:</p>
  <ul class="list-disc pl-6 space-y-2 mt-3 text-gray-300">
    <li><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf (e.g., payment processing, shipping, email delivery)</li>
    <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
    <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety</li>
    <li><strong>With Your Consent:</strong> We may share information with your explicit consent</li>
  </ul>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">5. Data Security</h2>
  <p class="text-gray-300 leading-relaxed">
    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
  </p>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">6. Your Rights and Choices</h2>
  <p class="text-gray-300 leading-relaxed">Depending on your location, you may have certain rights regarding your personal information, including:</p>
  <ul class="list-disc pl-6 space-y-2 mt-3 text-gray-300">
    <li><strong>Access:</strong> Request access to your personal information</li>
    <li><strong>Correction:</strong> Request correction of inaccurate information</li>
    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
    <li><strong>Opt-out:</strong> Opt-out of marketing communications</li>
    <li><strong>Data Portability:</strong> Request transfer of your data</li>
    <li><strong>Objection:</strong> Object to certain processing activities</li>
  </ul>
  <p class="mt-4 text-gray-300 leading-relaxed">
    To exercise these rights, please contact us at <a href="mailto:privacy@wilderbots.com" class="text-purple-400 hover:text-purple-300">privacy@wilderbots.com</a>.
  </p>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
  <p class="text-gray-300 leading-relaxed">
    If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
  </p>
  <div class="mt-4 space-y-2 text-gray-300">
    <p><strong>Email:</strong> <a href="mailto:privacy@wilderbots.com" class="text-purple-400 hover:text-purple-300">privacy@wilderbots.com</a></p>
    <p><strong>Address:</strong> Wilderbots Inc.</p>
    <p class="text-gray-400">123 Innovation Drive, Tech Valley, CA 94025, USA</p>
  </div>
</section>`
      },
      {
        type: 'terms',
        title: 'Terms of Service',
        content: `<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
  <p class="text-gray-300 leading-relaxed">
    By accessing and using the Wilderbots website, products, and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
  </p>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">2. Use License</h2>
  <p class="text-gray-300 leading-relaxed">
    Permission is granted to temporarily access the materials on Wilderbots' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
  </p>
  <ul class="list-disc pl-6 space-y-2 mt-3 text-gray-300">
    <li>Modify or copy the materials</li>
    <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
    <li>Attempt to decompile or reverse engineer any software contained on Wilderbots' website</li>
    <li>Remove any copyright or other proprietary notations from the materials</li>
    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
  </ul>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">3. Products and Services</h2>
  <h3 class="text-xl font-semibold text-white mb-3 mt-6">3.1 Product Descriptions</h3>
  <p class="text-gray-300 leading-relaxed">
    We strive to provide accurate descriptions of our products. However, we do not warrant that product descriptions or other content on this site is accurate, complete, reliable, current, or error-free.
  </p>

  <h3 class="text-xl font-semibold text-white mb-3 mt-6">3.2 Pricing</h3>
  <p class="text-gray-300 leading-relaxed">
    All prices are subject to change without notice. We reserve the right to modify prices at any time. Prices do not include shipping and handling charges unless otherwise stated.
  </p>

  <h3 class="text-xl font-semibold text-white mb-3 mt-6">3.3 Availability</h3>
  <p class="text-gray-300 leading-relaxed">
    We reserve the right to limit the quantity of items purchased per person, per household, or per order. We also reserve the right to discontinue any product at any time.
  </p>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">4. Orders and Payment</h2>
  <h3 class="text-xl font-semibold text-white mb-3 mt-6">4.1 Order Acceptance</h3>
  <p class="text-gray-300 leading-relaxed">
    Your order is an offer to purchase products from us. We reserve the right to accept or reject your order for any reason, including product availability, errors in pricing or product information, or fraud prevention.
  </p>

  <h3 class="text-xl font-semibold text-white mb-3 mt-6">4.2 Payment Terms</h3>
  <p class="text-gray-300 leading-relaxed">
    Payment must be received before we ship your order. We accept major credit cards and other payment methods as indicated on our website. You represent and warrant that you have the legal right to use any payment method you provide.
  </p>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
  <p class="text-gray-300 leading-relaxed">
    All content on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and software, is the property of Wilderbots or its content suppliers and is protected by international copyright laws.
  </p>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">6. Contact Information</h2>
  <p class="text-gray-300 leading-relaxed">
    If you have any questions about these Terms of Service, please contact us:
  </p>
  <div class="mt-4 space-y-2 text-gray-300">
    <p><strong>Email:</strong> <a href="mailto:legal@wilderbots.com" class="text-purple-400 hover:text-purple-300">legal@wilderbots.com</a></p>
    <p><strong>Address:</strong> Wilderbots Inc.</p>
    <p class="text-gray-400">123 Innovation Drive, Tech Valley, CA 94025, USA</p>
  </div>
</section>`
      },
      {
        type: 'returns',
        title: 'Returns & Delivery Policy',
        content: `<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">1. Delivery Policy</h2>
  
  <h3 class="text-xl font-semibold text-white mb-3 mt-6">1.1 Shipping Methods</h3>
  <p class="text-gray-300 leading-relaxed">
    We offer various shipping options to accommodate your needs. Available shipping methods and estimated delivery times will be displayed during checkout.
  </p>

  <h3 class="text-xl font-semibold text-white mb-3 mt-6">1.2 Processing Time</h3>
  <p class="text-gray-300 leading-relaxed">
    Orders are typically processed within 1-3 business days after payment confirmation. Processing times may be longer during peak seasons or promotional periods. You will receive an email confirmation with tracking information once your order ships.
  </p>

  <h3 class="text-xl font-semibold text-white mb-3 mt-6">1.3 Shipping Costs</h3>
  <p class="text-gray-300 leading-relaxed">
    Shipping costs are calculated based on the shipping method selected, destination, and package weight. Shipping charges are displayed during checkout before you complete your purchase.
  </p>

  <h3 class="text-xl font-semibold text-white mb-3 mt-6">1.4 International Shipping</h3>
  <p class="text-gray-300 leading-relaxed">
    We ship to many countries worldwide. International orders may be subject to customs duties, taxes, and fees imposed by the destination country. These charges are the responsibility of the recipient and are not included in the product price or shipping cost.
  </p>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">2. Return Policy</h2>
  
  <h3 class="text-xl font-semibold text-white mb-3 mt-6">2.1 Return Eligibility</h3>
  <p class="text-gray-300 leading-relaxed">
    We want you to be completely satisfied with your purchase. You may return most items within 30 days of delivery for a full refund or exchange, provided that:
  </p>
  <ul class="list-disc pl-6 space-y-2 mt-3 text-gray-300">
    <li>The item is unused, unopened, and in its original packaging</li>
    <li>The item is in the same condition as when you received it</li>
    <li>All original tags, labels, and accessories are included</li>
    <li>You have proof of purchase (order number or receipt)</li>
  </ul>

  <h3 class="text-xl font-semibold text-white mb-3 mt-6">2.2 Return Process</h3>
  <p class="text-gray-300 leading-relaxed">To initiate a return:</p>
  <ol class="list-decimal pl-6 space-y-2 mt-3 text-gray-300">
    <li>Contact our customer service team at <a href="mailto:returns@wilderbots.com" class="text-purple-400 hover:text-purple-300">returns@wilderbots.com</a> or through our contact form</li>
    <li>Provide your order number and reason for return</li>
    <li>Receive a Return Authorization (RA) number</li>
    <li>Package the item securely in its original packaging</li>
    <li>Include the RA number and return form in the package</li>
    <li>Ship the package to the address provided in your return instructions</li>
  </ol>

  <h3 class="text-xl font-semibold text-white mb-3 mt-6">2.3 Refund Processing</h3>
  <p class="text-gray-300 leading-relaxed">
    Once we receive and inspect your returned item, we will process your refund within 5-10 business days. Refunds will be issued to the original payment method used for the purchase. Please note that it may take additional time for your bank or credit card company to process the refund.
  </p>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">3. Contact Information</h2>
  <p class="text-gray-300 leading-relaxed">
    For questions about returns, delivery, or any other concerns, please contact us:
  </p>
  <div class="mt-4 space-y-2 text-gray-300">
    <p><strong>Email:</strong> <a href="mailto:returns@wilderbots.com" class="text-purple-400 hover:text-purple-300">returns@wilderbots.com</a></p>
    <p><strong>Customer Service:</strong> <a href="mailto:support@wilderbots.com" class="text-purple-400 hover:text-purple-300">support@wilderbots.com</a></p>
    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
    <p><strong>Address:</strong> Wilderbots Inc.</p>
    <p class="text-gray-400">123 Innovation Drive, Tech Valley, CA 94025, USA</p>
    <p class="mt-4"><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM PST</p>
  </div>
</section>`
      }
    ]

    for (const policyData of policies) {
      const existing = await Policy.findOne({ type: policyData.type })
      if (!existing) {
        await Policy.create(policyData)
        console.log(`  ✓ Created policy: ${policyData.title}`)
      } else {
        console.log(`  - Policy already exists: ${policyData.title}`)
      }
    }

    console.log('\n✅ Seeding completed successfully!')
    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error seeding data:', error.message)
    await mongoose.disconnect()
    process.exit(1)
  }
}

seedData()

