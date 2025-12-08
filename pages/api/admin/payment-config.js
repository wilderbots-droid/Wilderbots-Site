import connectDB from '../../../lib/mongodb'
import { getAdminFromRequest } from '../../../lib/adminAuth'
import PaymentConfig from '../../../models/PaymentConfig'

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await connectDB()

  if (req.method === 'GET') {
    try {
      const paymentConfig = await PaymentConfig.getPaymentConfig()
      // Don't send the secret key in response for security
      const safeConfig = {
        razorpayKeyId: paymentConfig.razorpayKeyId,
        isEnabled: paymentConfig.isEnabled,
        hasKeySecret: !!paymentConfig.razorpayKeySecret,
        hasWebhookSecret: !!paymentConfig.webhookSecret
      }
      res.status(200).json({ success: true, paymentConfig: safeConfig })
    } catch (error) {
      console.error('Get payment config error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      let paymentConfig = await PaymentConfig.findOne()
      if (!paymentConfig) {
        paymentConfig = new PaymentConfig()
      }

      // Update fields
      if (req.body.razorpayKeyId !== undefined) {
        paymentConfig.razorpayKeyId = req.body.razorpayKeyId
      }
      if (req.body.razorpayKeySecret !== undefined) {
        paymentConfig.razorpayKeySecret = req.body.razorpayKeySecret
      }
      if (req.body.isEnabled !== undefined) {
        paymentConfig.isEnabled = req.body.isEnabled
      }
      if (req.body.webhookSecret !== undefined) {
        paymentConfig.webhookSecret = req.body.webhookSecret
      }

      await paymentConfig.save()

      // Return safe config (without secrets)
      const safeConfig = {
        razorpayKeyId: paymentConfig.razorpayKeyId,
        isEnabled: paymentConfig.isEnabled,
        hasKeySecret: !!paymentConfig.razorpayKeySecret,
        hasWebhookSecret: !!paymentConfig.webhookSecret
      }

      res.status(200).json({ success: true, paymentConfig: safeConfig })
    } catch (error) {
      console.error('Update payment config error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
