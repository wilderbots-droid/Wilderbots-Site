import connectDB from '../../../../lib/mongodb'
import ProductImage from '../../../../models/ProductImage'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()
    
    const { id } = req.query
    
    if (!id) {
      return res.status(400).json({ error: 'Image ID is required' })
    }

    const image = await ProductImage.findById(id)
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' })
    }

    // Set appropriate headers for image serving
    res.setHeader('Content-Type', image.contentType)
    res.setHeader('Content-Length', image.size)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.setHeader('Content-Disposition', `inline; filename="${image.filename}"`)

    // Send the image data
    res.send(image.data)
  } catch (error) {
    console.error('Error serving product image:', error)
    res.status(500).json({ error: 'Failed to serve image' })
  }
}
