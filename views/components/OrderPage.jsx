import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, Truck, Package, Users, CreditCard, ShieldCheck, ArrowRight, MapPin, Plus, Star, Home, Building } from 'lucide-react'
import Image from 'next/image'
import Logo from './Logo'
import { useAuth } from '../../contexts/AuthContext'

export default function OrderPage({ onBack }) {
  const { user } = useAuth()
  const [orderStep, setOrderStep] = useState('form') // 'form' | 'processing' | 'success'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    postalCode: '',
    state: '',
    country: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  })
  const [orderId, setOrderId] = useState(null)
  const [trackingNumber, setTrackingNumber] = useState(null)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [useNewAddress, setUseNewAddress] = useState(true)
  const [showSaveAddress, setShowSaveAddress] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  useEffect(() => {
    // Fetch saved addresses if user is logged in
    if (user) {
      fetchSavedAddresses()
      const nameParts = (user.name || '').split(' ')
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || ''
      }))
    }

    // Load Razorpay script
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => setRazorpayLoaded(true)
      document.body.appendChild(script)
    } else if (window.Razorpay) {
      setRazorpayLoaded(true)
    }
  }, [user])

  const fetchSavedAddresses = async () => {
    try {
      const token = localStorage.getItem('wilderbots_token')
      if (!token) return

      const response = await fetch('/api/auth/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setSavedAddresses(data.addresses || [])
        
        // Auto-select default address if available
        const defaultAddress = data.addresses?.find(addr => addr.isDefault)
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id)
          setUseNewAddress(false)
          loadAddressToForm(defaultAddress)
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const loadAddressToForm = (address) => {
    setFormData(prev => ({
      ...prev,
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      postalCode: address.zipCode,
      state: address.state || '',
      country: address.country
    }))
  }

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId)
    setUseNewAddress(false)
    const address = savedAddresses.find(addr => addr._id === addressId)
    if (address) {
      loadAddressToForm(address)
    }
  }

  const handleUseNewAddress = () => {
    setUseNewAddress(true)
    setSelectedAddressId(null)
    // Clear address fields but keep name/email
    setFormData(prev => ({
      ...prev,
      street: '',
      city: '',
      postalCode: '',
      state: '',
      country: ''
    }))
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate address selection
    if (!useNewAddress && !selectedAddressId) {
      alert('Please select a shipping address')
      return
    }
    
    if (useNewAddress && (!formData.street || !formData.city || !formData.postalCode || !formData.country)) {
      alert('Please fill in all required address fields')
      return
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill in all required contact information')
      return
    }

    if (!razorpayLoaded) {
      alert('Payment gateway is loading. Please wait a moment and try again.')
      return
    }
    
    setOrderStep('processing')
    
    try {
      // Get shipping address - either from selected saved address or form data
      let shippingAddress
      if (!useNewAddress && selectedAddressId) {
        const selectedAddress = savedAddresses.find(addr => addr._id === selectedAddressId)
        if (selectedAddress) {
          shippingAddress = {
            street: selectedAddress.street,
            city: selectedAddress.city,
            state: selectedAddress.state,
            zipCode: selectedAddress.zipCode,
            country: selectedAddress.country
          }
        }
      } else {
        shippingAddress = {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.postalCode,
          country: formData.country
        }
      }

      // Prepare order data
      const orderData = {
        items: [{
          name: 'Wilder Watch Dev Kit',
          quantity: 1,
          price: 299.00
        }],
        totalAmount: 299.00,
        shippingAddress,
        contactInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        }
      }

      // Get auth token if user is logged in
      const token = localStorage.getItem('wilderbots_token')
      const headers = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      // Create order in MongoDB first (with pending status)
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      })

      const orderData_result = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData_result.error || 'Failed to create order')
      }

      const createdOrderId = orderData_result.order.id
      setOrderId(createdOrderId)
      setTrackingNumber(orderData_result.order.trackingNumber)

      // Create Razorpay order
      const razorpayResponse = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 299.00,
          currency: 'USD', // Razorpay supports USD, INR, and other currencies
          orderId: createdOrderId
        }),
      })

      const razorpayData = await razorpayResponse.json()

      if (!razorpayResponse.ok) {
        throw new Error(razorpayData.error || 'Failed to initialize payment')
      }

      // Open Razorpay checkout
      const options = {
        key: razorpayData.order.key,
        amount: razorpayData.order.amount,
        currency: razorpayData.order.currency,
        name: 'Wilderbots',
        description: 'Wilder Watch Dev Kit',
        order_id: razorpayData.order.id,
        handler: async function (response) {
          // Payment successful, verify on backend
          try {
            const verifyResponse = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: createdOrderId
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok && verifyData.success) {
              // Save address if user opted to save it
              if (user && showSaveAddress && useNewAddress) {
                try {
                  const token = localStorage.getItem('wilderbots_token')
                  await fetch('/api/auth/addresses', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      label: 'Home',
                      firstName: formData.firstName,
                      lastName: formData.lastName,
                      street: formData.street,
                      city: formData.city,
                      state: formData.state,
                      zipCode: formData.postalCode,
                      country: formData.country,
                      isDefault: savedAddresses.length === 0
                    }),
                  })
                } catch (error) {
                  console.error('Error saving address:', error)
                }
              }

              // Save to localStorage for backward compatibility
              const localStorageOrder = {
                id: createdOrderId,
                product: 'Wilder Watch Dev Kit',
                amount: 299.00,
                userId: user?.id || null,
                status: 'confirmed',
                trackingNumber: orderData_result.order.trackingNumber,
                createdAt: new Date().toISOString(),
                shippingAddress: orderData.shippingAddress,
                contactInfo: orderData.contactInfo,
                paymentId: response.razorpay_payment_id
              }
              
              const orders = JSON.parse(localStorage.getItem('wilderbots_orders') || '[]')
              orders.push(localStorageOrder)
              localStorage.setItem('wilderbots_orders', JSON.stringify(orders))
              
              setOrderStep('success')
              window.scrollTo(0, 0)
            } else {
              throw new Error(verifyData.error || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            alert(`Payment verification failed: ${error.message}. Please contact support.`)
            setOrderStep('form')
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
        },
        theme: {
          color: '#10b981'
        },
        modal: {
          ondismiss: function() {
            setOrderStep('form')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
      
    } catch (error) {
      console.error('Order submission error:', error)
      alert(`Failed to process order: ${error.message}. Please try again.`)
      setOrderStep('form')
    }
  }

  if (orderStep === 'success') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle size={48} className="text-black" />
        </div>
        <h2 className="text-4xl font-bold mb-4">Payment Confirmed!</h2>
        <p className="text-xl text-gray-400 mb-8 max-w-lg">
          Thank you for joining the revolution. Your Wilder Watch Dev Kit order has been secured.
        </p>
        <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl mb-8 max-w-md w-full">
          <div className="flex items-start gap-4 mb-4">
            <Truck className="text-blue-400 flex-shrink-0" />
            <div className="text-left">
              <h4 className="font-bold">Estimated Delivery</h4>
              <p className="text-gray-400 text-sm">Your kit will ship in exactly 10 business days.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Package className="text-yellow-400 flex-shrink-0" />
            <div className="text-left">
              <h4 className="font-bold">Tracking</h4>
              {trackingNumber ? (
                <div>
                  <p className="text-white font-mono text-sm mb-1">Tracking: {trackingNumber}</p>
                  <p className="text-gray-400 text-sm">You can track your order using this number.</p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Tracking number will be emailed to you within 24 hours.</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => {
            if (onBack) {
              onBack()
            } else if (typeof window !== 'undefined') {
              window.location.href = '/'
            }
          }}
          className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
        >
          Return Home
        </button>
          <a
            href="/track-order"
            className="px-8 py-4 bg-purple-500 text-white font-bold rounded-full hover:bg-purple-400 transition-colors inline-flex items-center justify-center gap-2"
          >
            Track Order <ArrowRight size={18} />
          </a>
          {user && (
            <a
              href="/dashboard"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
            >
              View Dashboard
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500 selection:text-black">
      {/* Simple Header */}
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
          <span className="font-bold">Secure Checkout</span>
        </div>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>
      <div className="max-w-6xl mx-auto p-6 grid lg:grid-cols-2 gap-12 py-12">
        {/* Left Col: Product Info */}
        <div className="space-y-8">
          <div className="bg-neutral-900 rounded-3xl p-8 border border-white/10">
            <div className="inline-block px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full mb-4">IN STOCK</div>
            <h1 className="text-3xl font-bold mb-2">Wilder Watch Dev Kit</h1>
            <p className="text-gray-400 mb-6">Complete Edition • Onyx Black PCB</p>
            
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6 relative group">
              <Image 
                src="/kit.png"
                alt="Wilder Watch Dev Kit" 
                fill
                className="object-cover opacity-80"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div className="flex gap-4 text-xs font-mono text-green-400">
                  <span>[W1-CHIP]</span>
                  <span>[ESP32-S3]</span>
                  <span>[LIPO-350]</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xl font-bold border-t border-white/10 pt-4">
              <span>Total</span>
              <span>$299.00</span>
            </div>
          </div>
          <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-6 flex gap-4">
            <ShieldCheck className="text-blue-400 w-8 h-8 flex-shrink-0" />
            <div>
              <h4 className="font-bold mb-1 text-blue-100">Pre-Payment Only</h4>
              <p className="text-sm text-blue-200/60">
                To secure your hardware allocation, full payment is required upfront. We do not support Cash on Delivery (COD) for Development Kits.
              </p>
            </div>
          </div>
          <div className="bg-neutral-900 rounded-2xl p-6 flex gap-4 border border-white/5">
            <Truck className="text-gray-400 w-8 h-8 flex-shrink-0" />
            <div>
              <h4 className="font-bold mb-1">Shipping Policy</h4>
              <p className="text-sm text-gray-400">
                Orders are processed immediately. Due to high demand and quality assurance checks, 
                <span className="text-white font-bold"> shipping commences 10 days after order confirmation.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><Users size={20} /> Contact Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" aria-label="First Name" className="bg-neutral-900 border border-white/10 rounded-lg p-4 w-full focus:border-green-500 outline-none transition-colors" />
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" aria-label="Last Name" className="bg-neutral-900 border border-white/10 rounded-lg p-4 w-full focus:border-green-500 outline-none transition-colors" />
              </div>
              <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" aria-label="Email Address" className="bg-neutral-900 border border-white/10 rounded-lg p-4 w-full focus:border-green-500 outline-none transition-colors" />
            </div>
            <div className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2"><Truck size={20} /> Shipping Address</h3>
                {user && savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={handleUseNewAddress}
                    className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add New
                  </button>
                )}
              </div>

              {/* Saved Addresses Selection */}
              {user && savedAddresses.length > 0 && !useNewAddress && (
                <div className="space-y-3 mb-4">
                  {savedAddresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => handleAddressSelect(address._id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedAddressId === address._id
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-white/10 bg-neutral-900 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {address.label === 'Home' && <Home size={16} className="text-purple-400" />}
                          {address.label === 'Work' && <Building size={16} className="text-blue-400" />}
                          {address.label === 'Other' && <MapPin size={16} className="text-gray-400" />}
                          <span className="font-semibold text-white">{address.label}</span>
                          {address.isDefault && (
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === address._id}
                          onChange={() => handleAddressSelect(address._id)}
                          className="w-4 h-4 text-green-500"
                        />
                      </div>
                      <div className="mt-2 text-sm text-gray-300">
                        <p>{address.firstName} {address.lastName}</p>
                        <p>{address.street}</p>
                        <p>{address.city}{address.state && `, ${address.state}`} {address.zipCode}</p>
                        <p>{address.country}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleUseNewAddress}
                    className="w-full p-3 border-2 border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Use a different address
                  </button>
                </div>
              )}

              {/* Address Form */}
              {(useNewAddress || savedAddresses.length === 0) && (
                <>
                  <input required type="text" name="street" value={formData.street} onChange={handleInputChange} placeholder="Street Address" aria-label="Street Address" className="bg-neutral-900 border border-white/10 rounded-lg p-4 w-full focus:border-green-500 outline-none transition-colors" />
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" aria-label="City" className="bg-neutral-900 border border-white/10 rounded-lg p-4 w-full focus:border-green-500 outline-none transition-colors" />
                    <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Postal Code" aria-label="Postal Code" className="bg-neutral-900 border border-white/10 rounded-lg p-4 w-full focus:border-green-500 outline-none transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State/Province" aria-label="State" className="bg-neutral-900 border border-white/10 rounded-lg p-4 w-full focus:border-green-500 outline-none transition-colors" />
                    <input required type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="Country" aria-label="Country" className="bg-neutral-900 border border-white/10 rounded-lg p-4 w-full focus:border-green-500 outline-none transition-colors" />
                  </div>

                  {/* Save Address Option */}
                  {user && (
                    <div className="mt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showSaveAddress}
                          onChange={(e) => setShowSaveAddress(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-600 bg-black text-green-500 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-300">Save this address for future orders</span>
                      </label>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><CreditCard size={20} /> Payment</h3>
              <div className="p-4 bg-green-900/20 border border-green-500 rounded-lg flex gap-3 items-center">
                <div className="w-4 h-4 rounded-full border-4 border-green-500"></div>
                <div className="flex-1">
                  <span className="font-bold">Secure Payment via Razorpay</span>
                  <p className="text-xs text-gray-400 mt-1">Pay securely using Credit/Debit Card, UPI, Net Banking, or Wallets</p>
                </div>
                <div className="ml-auto flex gap-2 items-center">
                  {/* Visa Logo */}
                  <div className="relative w-12 h-8">
                    <Image 
                      src="/visa-logo.svg"
                      alt="Visa"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  {/* Mastercard Logo */}
                  <div className="relative w-12 h-8">
                    <Image 
                      src="/mastercard-logo.svg"
                      alt="Mastercard"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-200/80">
                  <strong>Note:</strong> You will be redirected to Razorpay's secure payment page after clicking "Pay & Pre-Order". 
                  Your payment information is processed securely and never stored on our servers.
                </p>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={orderStep === 'processing' || !razorpayLoaded}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold text-xl py-5 rounded-full mt-8 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {orderStep === 'processing' ? 'Processing...' : !razorpayLoaded ? 'Loading Payment Gateway...' : 'Pay $299.00 & Pre-Order'}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              By clicking above, you agree to the 10-day shipping lead time and our Terms of Service.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

