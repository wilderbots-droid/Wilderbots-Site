import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import Email from '../../../models/Email'
import { fetchEmails } from '../../../lib/imapService'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const { direction = 'all', limit = 50, skip = 0, search, isRead, isStarred, isArchived, emailAccount } = req.query

      const query = {}
      
      if (direction !== 'all') {
        query.direction = direction
      }
      
      if (isRead !== undefined) {
        query.isRead = isRead === 'true'
      }
      
      if (isStarred !== undefined) {
        query.isStarred = isStarred === 'true'
      }
      
      if (isArchived !== undefined) {
        // If explicitly set, use the value (can be 'true' or 'false' string)
        query.isArchived = isArchived === 'true'
      } else if (isStarred !== undefined && isStarred === 'true') {
        // When viewing starred emails, exclude archived by default
        query.isArchived = false
      } else {
        // By default, don't show archived emails
        query.isArchived = false
      }
      
      // Filter by email account (for received emails, check 'to' field; for sent, check 'from')
      if (emailAccount) {
        if (direction === 'sent') {
          query['from.address'] = emailAccount
        } else if (direction === 'received') {
          query['to.address'] = emailAccount
        } else {
          // For 'all', check both sent and received
          query.$or = [
            { 'from.address': emailAccount },
            { 'to.address': emailAccount }
          ]
        }
      }
      
      if (search) {
        const searchConditions = [
          { subject: { $regex: search, $options: 'i' } },
          { text: { $regex: search, $options: 'i' } },
          { 'from.address': { $regex: search, $options: 'i' } },
          { 'from.name': { $regex: search, $options: 'i' } },
          { 'to.address': { $regex: search, $options: 'i' } }
        ]
        
        if (query.$or) {
          // Combine with emailAccount filter
          query.$and = [
            { $or: query.$or },
            { $or: searchConditions }
          ]
          delete query.$or
        } else {
          query.$or = searchConditions
        }
      }

      const emails = await Email.find(query)
        .sort({ date: -1, sentAt: -1, createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .lean()

      const total = await Email.countDocuments(query)

      res.status(200).json({
        success: true,
        emails,
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      })
    } catch (error) {
      console.error('Get inbox error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    // Fetch new emails from IMAP
    try {
      const { configId, configIds, limit = 50, fetchAll = false } = req.body

      // If fetchAll is true or configIds array is provided, fetch from multiple configs
      if (fetchAll || (configIds && Array.isArray(configIds) && configIds.length > 0)) {
        const SMTPConfig = (await import('../../../models/SMTPConfig')).default
        const configsToFetch = fetchAll 
          ? await SMTPConfig.find({ isActive: true, 'imap.host': { $exists: true, $ne: '' } }).lean()
          : await SMTPConfig.find({ _id: { $in: configIds }, isActive: true }).lean()

        const allEmails = []
        const results = []

        for (const config of configsToFetch) {
          try {
            const emails = await fetchEmails(config._id.toString(), limit)
            allEmails.push(...emails)
            results.push({
              configId: config._id.toString(),
              configName: config.name,
              email: config.from.address,
              count: emails.length
            })
          } catch (error) {
            console.error(`Error fetching from ${config.name}:`, error)
            results.push({
              configId: config._id.toString(),
              configName: config.name,
              email: config.from.address,
              count: 0,
              error: error.message
            })
          }
        }

        res.status(200).json({
          success: true,
          message: `Fetched ${allEmails.length} email(s) from ${results.length} account(s)`,
          emails: allEmails,
          results
        })
      } else {
        // Single config fetch (original behavior)
        const emails = await fetchEmails(configId, limit)
        res.status(200).json({
          success: true,
          message: `Fetched ${emails.length} email(s)`,
          emails
        })
      }
    } catch (error) {
      console.error('Fetch emails error:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch emails'
      })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

