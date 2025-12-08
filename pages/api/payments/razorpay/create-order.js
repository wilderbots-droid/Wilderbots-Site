import connectDB from '../../../../lib/mongodb'
import PaymentConfig from '../../../../models/PaymentConfig'
import Razorpay from 'razorpay'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()

    // Get payment configuration
    const paymentConfig = await PaymentConfig.getPaymentConfig()
    
    if (!paymentConfig.isEnabled || !paymentConfig.razorpayKeyId || !paymentConfig.razorpayKeySecret) {
      return res.status(400).json({ 
        error: 'Razorpay is not configured. Please contact administrator.' 
      })
    }

    const { amount, currency = 'USD', orderId } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' })
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: paymentConfig.razorpayKeyId,
      key_secret: paymentConfig.razorpayKeySecret
    })

    // Convert amount to smallest currency unit (paise for INR, cents for USD, etc.)
    // Razorpay expects amount in smallest currency unit
    const amountInSmallestUnit = Math.round(amount * 100)

    // Create Razorpay order
    const options = {
      amount: amountInSmallestUnit,
      currency: currency,
      receipt: orderId || `order_${Date.now()}`,
      notes: {
        orderId: orderId
      }
    }

    const razorpayOrder = await razorpay.orders.create(options)

    res.status(200).json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: paymentConfig.razorpayKeyId
      }
    })
  } catch (error) {
    console.error('Create Razorpay order error:', error)
    res.status(500).json({ 
      error: error.message || 'Failed to create payment order. Please try again.' 
    })
  }
}
