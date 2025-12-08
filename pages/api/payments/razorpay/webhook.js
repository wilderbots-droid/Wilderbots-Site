import connectDB from '../../../../lib/mongodb'
import PaymentConfig from '../../../../models/PaymentConfig'
import Order from '../../../../models/Order'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()

    const webhookSecret = req.headers['x-razorpay-signature']
    const body = JSON.stringify(req.body)

    // Get payment configuration
    const paymentConfig = await PaymentConfig.getPaymentConfig()
    
    if (!paymentConfig.webhookSecret) {
      console.error('Webhook secret not configured')
      return res.status(500).json({ error: 'Webhook not configured' })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', paymentConfig.webhookSecret)
      .update(body)
      .digest('hex')

    if (webhookSecret !== expectedSignature) {
      console.error('Invalid webhook signature')
      return res.status(400).json({ error: 'Invalid signature' })
    }

    const event = req.body.event
    const payment = req.body.payload.payment?.entity || req.body.payload.payment
    const order = req.body.payload.order?.entity || req.body.payload.order

    if (!payment || !order) {
      return res.status(400).json({ error: 'Invalid webhook payload' })
    }

    // Find order by Razorpay order ID
    const dbOrder = await Order.findOne({ 
      'payment.razorpayOrderId': order.id 
    })

    if (!dbOrder) {
      console.error('Order not found for Razorpay order:', order.id)
      return res.status(404).json({ error: 'Order not found' })
    }

    // Update order based on event
    switch (event) {
      case 'payment.captured':
        dbOrder.payment.status = 'completed'
        dbOrder.payment.razorpayPaymentId = payment.id
        dbOrder.payment.transactionId = payment.id
        dbOrder.payment.paidAt = new Date(payment.captured_at * 1000)
        dbOrder.status = 'confirmed'
        break
      
      case 'payment.failed':
        dbOrder.payment.status = 'failed'
        dbOrder.status = 'cancelled'
        break
      
      case 'order.paid':
        dbOrder.payment.status = 'completed'
        dbOrder.status = 'confirmed'
        break
      
      default:
        console.log('Unhandled webhook event:', event)
    }

    await dbOrder.save()

    res.status(200).json({ success: true, message: 'Webhook processed' })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
}
