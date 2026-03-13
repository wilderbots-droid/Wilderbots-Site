import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const MONGODB_URI = process.env.MONGODB_URI

// Product Schema inline to avoid any model issues
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    edition: { type: String, default: 'Development Kit Edition' },
    engineeredBy: { type: String, default: 'Engineered by <br/>You.' },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

let Product
try {
  Product = mongoose.models.Product || mongoose.model('Product', productSchema)
} catch (error) {
  console.error('Model initialization error:', error)
}

// Verify token function
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connections[0].readyState === 1) {
    return
  }
  await mongoose.connect(MONGODB_URI)
}

// Main handler - NO MIDDLEWARE, NO next() PARAMETER
async function handler(req, res) {
  try {
    // Step 1: Verify admin token
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing authorization header' })
    }

    const token = authHeader.replace('Bearer ', '')
    const admin = verifyToken(token)
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' })
    }

    // Step 2: Connect to MongoDB
    await connectDB()

    // Step 3: Handle GET request
    if (req.method === 'GET') {
      const products = await Product.find().lean()
      return res.status(200).json({ success: true, products })
    }

    // Step 4: Handle POST request
    if (req.method === 'POST') {
      const productData = {
        title: req.body.title,
        subtitle: req.body.subtitle,
        edition: req.body.edition || 'Development Kit Edition',
        engineeredBy: req.body.engineeredBy || 'Engineered by <br/>You.',
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
        isActive: req.body.isActive !== false
      }

      const product = await Product.create(productData)
      return res.status(201).json({ success: true, product })
    }

    // Step 5: Handle PUT request
    if (req.method === 'PUT') {
      const { id } = req.query

      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' })
      }

      const product = await Product.findByIdAndUpdate(
        id,
        {
          title: req.body.title,
          subtitle: req.body.subtitle,
          edition: req.body.edition,
          engineeredBy: req.body.engineeredBy,
          description: req.body.description,
          price: req.body.price,
          image: req.body.image,
          isActive: req.body.isActive
        },
        { new: true, runValidators: false }
      )

      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }

      return res.status(200).json({ success: true, product })
    }

    // Step 6: Handle DELETE request
    if (req.method === 'DELETE') {
      const { id } = req.query

      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' })
      }

      const product = await Product.findByIdAndDelete(id)

      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }

      return res.status(200).json({ success: true, message: 'Product deleted successfully' })
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error:', error.message)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export default handler
