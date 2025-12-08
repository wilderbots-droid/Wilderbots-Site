import { useState } from 'react'
import { ArrowLeft, Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import Logo from './Logo'

export default function ForgotPasswordPage({ onBack }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email) {
      setError('Please enter your email address')
      setLoading(false)
      return
    }

    try {
      // Call API to send reset email
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email')
      }

      setSuccess(true)
      
      // In development, log the reset link if provided
      if (data.resetLink && process.env.NODE_ENV === 'development') {
        console.log('Reset link (dev only):', data.resetLink)
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-white/10 p-6 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-2">
          <Logo size={35} showText={false} />
          <span className="font-bold">Reset Password</span>
        </div>
        <div className="w-16"></div>
      </div>

      {/* Form */}
      <section className="py-24 px-6">
        <div className="max-w-md mx-auto">
          {success ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-400" size={40} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Check Your Email</h1>
              <p className="text-gray-400 mb-2">
                We've sent a password reset link to <span className="text-white font-semibold">{email}</span>
              </p>
              <p className="text-sm text-gray-500 mb-8">
                The email will be sent from <span className="text-purple-400">support@wilderbots.com</span>
              </p>
              <p className="text-sm text-gray-400 mb-8">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>
              <div className="space-y-4">
                <button
                  onClick={onBack}
                  className="w-full bg-white text-black font-bold py-4 rounded-full hover:bg-gray-200 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  Back to Login <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                  }}
                  className="w-full bg-transparent border border-white/20 text-white font-bold py-4 rounded-full hover:bg-white/10 transition-all"
                >
                  Resend Email
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Forgot Password?</h1>
                <p className="text-gray-400">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:border-purple-500 outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-bold py-4 rounded-full hover:bg-gray-200 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Remember your password?{' '}
                  <a href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                    Sign in
                  </a>
                </p>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-400 text-center">
                  <Mail className="inline mr-2" size={16} />
                  Reset emails are sent from <span className="font-semibold">support@wilderbots.com</span>
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

