/**
 * Script to seed a default product to MongoDB
 * Run with: node scripts/seed-product.js
 */

import mongoose from 'mongoose'
import connectDB from '../lib/mongodb.js'

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  edition: { type: String, default: 'Development Kit Edition' },
  engineeredBy: { type: String, default: 'Engineered by <br/>You.' },
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
      title: 'Not just a Watch.<br/>It\'s a Workshop.',
      subtitle: 'The Wilder Watch Development Kit. You don\'t just buy it. You build it.',
      edition: 'Development Kit Edition',
      engineeredBy: 'Engineered by <br/>You.',
      description: 'The Wilder Watch arrives as a modular kit. Follow our interactive guides to assemble the PCB, display, and battery. Then, flash your own code or use our open-source OS to customize every watch face, gesture, and AI feature.',
      price: 299,
      image: '/kit.png',
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
