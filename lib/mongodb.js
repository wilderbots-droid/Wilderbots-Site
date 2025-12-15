import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://wilderbots_db_user:8JBo8irTcBbRFAMB@wilderbotssite.lwn8esy.mongodb.net/wilderbots_db?retryWrites=true&w=majority'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Azure-friendly connection options
      serverSelectionTimeoutMS: 30000, // 30 seconds - Azure needs longer timeout
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 30000, // 30 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      retryWrites: true,
      retryReads: true,
    }

    // Log connection attempt (helpful for Azure debugging)
    console.log('Attempting to connect to MongoDB...')
    console.log('MongoDB URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')) // Hide password in logs

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully')
        return mongoose
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message)
        console.error('Error details:', {
          name: error.name,
          code: error.code,
          codeName: error.codeName
        })
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('Failed to establish MongoDB connection:', e.message)
    throw e
  }

  return cached.conn
}

export default connectDB

