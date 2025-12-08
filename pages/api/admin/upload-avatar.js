import { getAdminFromRequest } from '../../../lib/adminAuth'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

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

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars')
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
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

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.originalFilename || 'avatar'
    const ext = path.extname(originalName) || '.jpg'
    const filename = `avatar_${timestamp}${ext}`
    const filepath = path.join(uploadDir, filename)

    // Move file to final location
    fs.renameSync(file.filepath, filepath)

    // Return the public URL
    const publicUrl = `/uploads/avatars/${filename}`

    res.status(200).json({
      success: true,
      url: publicUrl,
      filename: filename
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'File upload failed: ' + error.message })
  }
}

