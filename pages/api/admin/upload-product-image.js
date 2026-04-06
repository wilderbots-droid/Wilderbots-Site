import { getAdminFromRequest } from '../../../lib/adminAuth'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import connectDB from '../../../lib/mongodb'
import ProductImage from '../../../models/ProductImage'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  try {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: (part) => {
        // Only allow image files
        return part.mimetype && part.mimetype.startsWith('image/')
      },
    })

    const [fields, files] = await form.parse(req)
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Read file data
    const fileData = fs.readFileSync(file.filepath)
    
    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.originalFilename || 'product_image'
    const ext = path.extname(originalName) || '.jpg'
    const filename = `product_${timestamp}${ext}`

    // Save to MongoDB
    const productImage = new ProductImage({
      filename: filename,
      data: fileData,
      contentType: file.mimetype || 'image/jpeg',
      size: file.size,
      uploadedBy: admin.id
    })

    await productImage.save()

    // Clean up temporary file
    fs.unlinkSync(file.filepath)

    // Return the API URL to serve the image
    const publicUrl = `/api/admin/product-image/${productImage._id}`

    res.status(200).json({
      success: true,
      url: publicUrl,
      filename: filename,
      id: productImage._id.toString()
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'File upload failed: ' + error.message })
  }
}
