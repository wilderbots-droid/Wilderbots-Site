/**
 * Script to create a default admin user
 * Run with: node scripts/create-default-admin.js
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import connectDB from '../lib/mongodb.js'

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now }
})

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)

async function createDefaultAdmin() {
  try {
    await connectDB()
    console.log('Connected to MongoDB\n')

    const defaultEmail = 'admin@wilderbots.com'
    const defaultPassword = 'admin123'
    const defaultName = 'Admin User'

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: defaultEmail })
    if (existingAdmin) {
      console.log('✅ Admin already exists!')
      console.log(`   Email: ${defaultEmail}`)
      console.log(`   Password: ${defaultPassword}`)
      console.log('\n   You can use these credentials to login at /admin/login')
      await mongoose.disconnect()
      process.exit(0)
    }

    // Hash password before creating admin
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)

    // Create new admin
    const admin = new Admin({
      name: defaultName,
      email: defaultEmail,
      password: hashedPassword,
      role: 'super_admin'
    })

    await admin.save()

    console.log('✅ Default admin created successfully!\n')
    console.log('📋 Login Credentials:')
    console.log('   Email: admin@wilderbots.com')
    console.log('   Password: admin123')
    console.log('\n🔐 Please change the password after first login!')
    console.log('\n   Access admin panel at: http://localhost:3000/admin/login')
    
    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message)
    await mongoose.disconnect()
    process.exit(1)
  }
}

createDefaultAdmin()

