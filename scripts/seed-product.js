/**
 * Script to seed a default product to MongoDB
 * Run with: node scripts/seed-product.js
 */

import mongoose from 'mongoose'
import connectDB from '../lib/mongodb.js'

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  edition: { type: String, default: 'Launch Edition' },
  engineeredBy: { type: String, default: 'Built by <br/>Wilderbots.' },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Product = mongoose.model('Product', ProductSchema)

async function seedProduct() {
  try {
    await connectDB()

    // Check if product already exists
    const existingProduct = await Product.findOne({ isActive: true })
    if (existingProduct) {
      console.log('✓ Active product already exists')
      process.exit(0)
    }

    // Create default product
    const defaultProduct = new Product({
      title: 'Wilderbots Launch Package',
      subtitle: 'A structured path from discovery to delivery for teams building serious digital systems.',
      edition: 'Launch Edition',
      engineeredBy: 'Built by <br/>Wilderbots.',
      description: 'Start with a guided discovery phase, move into architecture and delivery, and launch with a clear rollout plan supported by the Wilderbots team.',
      price: 299,
      image: '/logo.png',
      isActive: true
    })

    await defaultProduct.save()
    console.log('✓ Default product created successfully')
    console.log('Product:', {
      title: defaultProduct.title,
      price: defaultProduct.price,
      image: defaultProduct.image
    })

    process.exit(0)
  } catch (error) {
    console.error('Error seeding product:', error)
    process.exit(1)
  }
}

seedProduct()
