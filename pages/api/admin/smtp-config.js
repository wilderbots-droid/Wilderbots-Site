import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import SMTPConfig from '../../../models/SMTPConfig'
import { testSMTPConnection, testIMAPConnection } from '../../../lib/emailService'
import { testIMAPConnection as testIMAP } from '../../../lib/imapService'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const configs = await SMTPConfig.find()
        .sort({ isDefault: -1, createdAt: -1 })
        .lean()
        .select('-auth.pass -imap.auth.pass') // Don't send passwords

      res.status(200).json({
        success: true,
        configs
      })
    } catch (error) {
      console.error('Get SMTP configs error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, host, port, secure, auth, from, imap, isActive, isDefault } = req.body

      if (!name || !host || !port || !auth?.user || !auth?.pass || !from?.address) {
        return res.status(400).json({ error: 'Name, host, port, auth, and from address are required' })
      }

      // If setting as default, unset other default configs
      if (isDefault) {
        await SMTPConfig.updateMany(
          { isDefault: true },
          { $set: { isDefault: false } }
        )
      }

      const config = await SMTPConfig.create({
        name,
        host,
        port: parseInt(port),
        secure: secure === true || secure === 'true',
        auth: {
          user: auth.user,
          pass: auth.pass
        },
        from: {
          name: from.name || '',
          address: from.address
        },
        imap: imap ? {
          host: imap.host || '',
          port: imap.port ? parseInt(imap.port) : 993,
          secure: imap.secure !== false,
          auth: {
            user: imap.auth?.user || '',
            pass: imap.auth?.pass || ''
          }
        } : undefined,
        isActive: isActive !== undefined ? isActive : true,
        isDefault: isDefault || false
      })

      // Return config without passwords
      const configObj = config.toObject()
      delete configObj.auth.pass
      if (configObj.imap?.auth) {
        delete configObj.imap.auth.pass
      }

      res.status(201).json({
        success: true,
        config: configObj
      })
    } catch (error) {
      console.error('Create SMTP config error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, name, host, port, secure, auth, from, imap, isActive, isDefault } = req.body

      if (!id) {
        return res.status(400).json({ error: 'Config ID is required' })
      }

      const updateData = {}
      if (name !== undefined) updateData.name = name
      if (host !== undefined) updateData.host = host
      if (port !== undefined) updateData.port = parseInt(port)
      if (secure !== undefined) updateData.secure = secure === true || secure === 'true'
      if (auth !== undefined) {
        updateData.auth = {
          user: auth.user,
          pass: auth.pass
        }
      }
      if (from !== undefined) {
        updateData.from = {
          name: from.name || '',
          address: from.address
        }
      }
      if (imap !== undefined) {
        updateData.imap = {
          host: imap.host || '',
          port: imap.port ? parseInt(imap.port) : 993,
          secure: imap.secure !== false,
          auth: {
            user: imap.auth?.user || '',
            pass: imap.auth?.pass || ''
          }
        }
      }
      if (isActive !== undefined) updateData.isActive = isActive
      if (isDefault !== undefined) {
        updateData.isDefault = isDefault
        // If setting as default, unset other default configs
        if (isDefault) {
          await SMTPConfig.updateMany(
            { _id: { $ne: id }, isDefault: true },
            { $set: { isDefault: false } }
          )
        }
      }

      const config = await SMTPConfig.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      )

      if (!config) {
        return res.status(404).json({ error: 'SMTP config not found' })
      }

      // Return config without passwords
      const configObj = config.toObject()
      delete configObj.auth.pass
      if (configObj.imap?.auth) {
        delete configObj.imap.auth.pass
      }

      res.status(200).json({
        success: true,
        config: configObj
      })
    } catch (error) {
      console.error('Update SMTP config error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body

      if (!id) {
        return res.status(400).json({ error: 'Config ID is required' })
      }

      const config = await SMTPConfig.findById(id)
      if (!config) {
        return res.status(404).json({ error: 'SMTP config not found' })
      }

      // Prevent deleting default config
      if (config.isDefault) {
        return res.status(400).json({ error: 'Cannot delete default SMTP config. Set another config as default first.' })
      }

      await SMTPConfig.findByIdAndDelete(id)

      res.status(200).json({
        success: true,
        message: 'SMTP config deleted successfully'
      })
    } catch (error) {
      console.error('Delete SMTP config error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}


