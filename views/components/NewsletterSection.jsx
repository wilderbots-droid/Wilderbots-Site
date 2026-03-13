import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // null | 'success' | 'error'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    setStatus(null)
    setMessage('')

    try {
      console.log('Sending subscription request...')
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      console.log('Response status:', response.status)
      
      const data = await response.json()
      console.log('Subscribe response:', response.status, data)

      if (response.ok || response.status === 200 || response.status === 201) {
        setStatus('success')
        setMessage(data.message || 'Thank you for subscribing!')
        setEmail('')
        console.log('✅ Subscription successful')
        setTimeout(() => {
          setStatus(null)
          setMessage('')
        }, 5000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
        console.error('❌ Subscribe error response:', response.status, data)
        setTimeout(() => {
          setStatus(null)
          setMessage('')
        }, 5000)
      }
    } catch (error) {
      console.error('❌ Subscription fetch error:', error)
      setStatus('error')
      setMessage('Failed to subscribe. Please try again later.')
      setTimeout(() => {
        setStatus(null)
        setMessage('')
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="vision" className="py-24 bg-neutral-900 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Join the Wild Side.</h2>
        <p className="text-gray-400 mb-10 text-lg">
          Stay updated on the Wilder Watch release dates and new courses on Neureck.
          No spam, just future.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-black/50 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
            aria-label="Email address"
          />
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Subscribing...' : (status === 'success' ? 'Subscribed!' : 'Subscribe')}
          </button>
        </form>
        {status === 'error' && message && (
          <p className="mt-4 text-red-400 text-sm">{message}</p>
        )}
        {status === 'success' && message && (
          <p className="mt-4 text-green-400 text-sm">{message}</p>
        )}
      </div>
    </section>
  )
}

