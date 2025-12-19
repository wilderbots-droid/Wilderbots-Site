import connectDB from '../../../../lib/mongodb'
import Avatar from '../../../../models/Avatar'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()
    
    const { id } = req.query
    
    if (!id) {
      return res.status(400).json({ error: 'Avatar ID is required' })
    }

    const avatar = await Avatar.findById(id)
    
    if (!avatar) {
      return res.status(404).json({ error: 'Avatar not found' })
    }

    // Set appropriate headers for image serving
    res.setHeader('Content-Type', avatar.contentType)
    res.setHeader('Content-Length', avatar.size)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.setHeader('Content-Disposition', `inline; filename="${avatar.filename}"`)

    // Send the image data (Mongoose returns Buffer directly)
    res.send(avatar.data)
  } catch (error) {
    console.error('Error serving avatar:', error)
    res.status(500).json({ error: 'Failed to serve avatar' })
  }
}
