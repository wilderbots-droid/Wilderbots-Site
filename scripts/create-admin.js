/**
 * Script to create the first admin user
 * Run with: node scripts/create-admin.js
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import readline from 'readline'
import connectDB from '../lib/mongodb.js'

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now }
})

AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function createAdmin() {
  try {
    await connectDB()
    console.log('Connected to MongoDB\n')

    const name = await question('Enter admin name: ')
    const email = await question('Enter admin email: ')
    const password = await question('Enter admin password: ')
    const role = await question('Enter role (admin/super_admin) [default: admin]: ') || 'admin'

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() })
    if (existingAdmin) {
      console.log('\n❌ Admin with this email already exists!')
      rl.close()
      process.exit(1)
    }

    const admin = new Admin({
      name,
      email: email.toLowerCase(),
      password,
      role
    })

    await admin.save()

    console.log('\n✅ Admin created successfully!')
    console.log(`   Name: ${admin.name}`)
    console.log(`   Email: ${admin.email}`)
    console.log(`   Role: ${admin.role}`)
    
    rl.close()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message)
    rl.close()
    process.exit(1)
  }
}

createAdmin()

