import { useState, useEffect } from 'react'
import { ArrowLeft, Package, Truck, CheckCircle, Clock, Search, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Logo from './Logo'
import { useRouter } from 'next/router'

export default function OrderTrackerPage({ onBack }) {
  const [orderId, setOrderId] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const { user, getOrderById, getUserOrders } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if order ID is in URL params
    if (router.query.orderId) {
      setOrderId(router.query.orderId)
      handleTrackOrder(router.query.orderId)
    }
  }, [router.query])

  const handleTrackOrder = (id) => {
    setError('')
    const foundOrder = getOrderById(id)
    
    if (!foundOrder) {
      setError('Order not found. Please check your order ID.')
      setOrder(null)
      return
    }

    // Check if user owns this order
    if (user && foundOrder.userId !== user.id) {
      setError('You do not have permission to view this order.')
      setOrder(null)
      return
    }

    setOrder(foundOrder)
    setTrackingNumber(foundOrder.trackingNumber || '')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      case 'processing':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'shipped':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20'
      case 'delivered':
        return 'text-green-400 bg-green-500/10 border-green-500/20'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="text-blue-400" size={20} />
      case 'processing':
        return <Clock className="text-yellow-400" size={20} />
      case 'shipped':
        return <Truck className="text-purple-400" size={20} />
      case 'delivered':
        return <CheckCircle className="text-green-400" size={20} />
      default:
        return <Package className="text-gray-400" size={20} />
    }
  }

  const getStatusSteps = (status) => {
    const steps = [
      { id: 'confirmed', label: 'Order Confirmed', completed: true },
      { id: 'processing', label: 'Processing', completed: status !== 'confirmed' },
      { id: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(status) },
      { id: 'delivered', label: 'Delivered', completed: status === 'delivered' }
    ]
    return steps
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-white/10 p-6 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <button 
          onClick={() => {
            if (onBack) {
              onBack()
            } else if (typeof window !== 'undefined') {
              window.location.href = '/'
            }
          }} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-2">
          <Logo size={35} showText={false} />
          <span className="font-bold">Track Order</span>
        </div>
        <div className="w-16"></div>
      </div>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Search Form */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Track Your Order</h1>
            <p className="text-gray-400 text-center mb-8">Enter your order ID or tracking number</p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Order ID (e.g., ORD-1234567890)"
                  className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:border-purple-500 outline-none transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder(orderId)}
                />
              </div>
              <button
                onClick={() => handleTrackOrder(orderId)}
                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all transform hover:scale-105 whitespace-nowrap"
              >
                Track Order
              </button>
            </div>

            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 max-w-2xl mx-auto">
                <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Order Details */}
          {order && (
            <div className="space-y-6">
              {/* Order Status Card */}
              <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Order {order.id}</h2>
                    <p className="text-gray-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="font-bold capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>

                {/* Tracking Number */}
                {trackingNumber && (
                  <div className="bg-black/50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-400 mb-1">Tracking Number</p>
                    <p className="text-xl font-bold font-mono">{trackingNumber}</p>
                  </div>
                )}

                {/* Status Timeline */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg mb-4">Order Status</h3>
                  {getStatusSteps(order.status).map((step, index) => (
                    <div key={step.id} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        step.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'bg-transparent border-white/20'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="text-white" size={20} />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${step.completed ? 'text-white' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        {step.id === 'shipped' && step.completed && (
                          <p className="text-sm text-gray-500 mt-1">
                            Estimated delivery: {new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-6">Order Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div>
                      <p className="font-bold">Wilder Watch Dev Kit</p>
                      <p className="text-sm text-gray-400">Complete Edition • Onyx Black PCB</p>
                    </div>
                    <p className="font-bold">$299.00</p>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <p className="text-gray-400">Shipping Address</p>
                    <div className="text-right">
                      {order.shippingAddress && (
                        <>
                          <p className="font-medium">{order.shippingAddress.street}</p>
                          <p className="text-sm text-gray-400">
                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                          </p>
                          <p className="text-sm text-gray-400">{order.shippingAddress.country}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <p className="text-xl font-bold">Total</p>
                    <p className="text-xl font-bold">$299.00</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Order Message */}
          {!order && !error && (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-400">Enter an order ID above to track your order</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

