import connectDB from '../../lib/mongodb'
import Product from '../../models/Product'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()

    const { id } = req.query

    // If ID is provided, fetch single product
    if (id) {
      // Use lean() to get plain JS object and avoid schema-based filtering
      const product = await Product.findById(id).lean()

      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }

      return res.status(200).json(product)
    }

    // Fetch all active products
    // We remove .select() to ensure everything is returned
    const products = await Product.find({ isActive: true })
      .sort({ isPrimary: -1, createdAt: -1 })
      .lean()

    res.status(200).json(products)
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
