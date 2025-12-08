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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification data is required' })
    }

    // Get payment configuration
    const paymentConfig = await PaymentConfig.getPaymentConfig()
    
    if (!paymentConfig.razorpayKeySecret) {
      return res.status(500).json({ error: 'Payment configuration not found' })
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const generatedSignature = crypto
      .createHmac('sha256', paymentConfig.razorpayKeySecret)
      .update(text)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' })
    }

    // Update order with payment information
    if (orderId) {
      const order = await Order.findById(orderId)
      if (order) {
        order.payment = {
          method: 'razorpay',
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: 'completed',
          transactionId: razorpay_payment_id,
          paidAt: new Date()
        }
        order.status = 'confirmed'
        await order.save()
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      }
    })
  } catch (error) {
    console.error('Verify payment error:', error)
    res.status(500).json({ 
      error: error.message || 'Failed to verify payment. Please try again.' 
    })
  }
}
