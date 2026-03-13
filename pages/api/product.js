import connectDB from '../../lib/mongodb'
import Product from '../../models/Product'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()
    
    // Fetch the active product (assumes there's only one main product)
    const product = await Product.findOne({ isActive: true })
      .select('-isActive -createdAt -updatedAt')
      .lean()

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.status(200).json(product)
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
