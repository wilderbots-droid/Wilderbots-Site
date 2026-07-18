import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import PublicPageShell from './PublicPageShell'

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
    <PublicPageShell
      onBack={onBack}
      eyebrow="Password Reset"
      title={<>Reset your<span className="block bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text italic text-transparent">Wilderbots access</span></>}
      description="Enter your email and we’ll send a secure reset link so you can get back into your account."
    >
      <section className="rounded-[2rem] border border-white/10 bg-zinc-950/35 px-6 py-12 backdrop-blur-xl">
        <div className="max-w-md mx-auto">
          {success ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-400" size={40} />
              </div>
              <h2 className="mb-4 font-serif-custom text-4xl font-normal text-white md:text-5xl">Check Your Email</h2>
              <p className="mb-2 text-zinc-400">
                We&apos;ve sent a password reset link to <span className="text-white font-semibold">{email}</span>
              </p>
              <p className="mb-8 text-sm text-zinc-500">
                The email will be sent from <span className="text-sky-300">support@wilderbots.com</span>
              </p>
              <p className="mb-8 text-sm text-zinc-400">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>
              <div className="space-y-4">
                <button
                  onClick={onBack}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f6df6] to-[#2452d9] py-4 font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-transform hover:scale-[1.01]"
                >
                  Back to Login <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                  }}
                  className="w-full rounded-full border border-white/15 bg-white/[0.03] py-4 font-semibold text-white transition-colors hover:bg-white/[0.06]"
                >
                  Resend Email
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="mb-4 font-serif-custom text-4xl font-normal text-white md:text-5xl">Forgot Password?</h2>
                <p className="text-zinc-400">
                  Enter your email address and we&apos;ll send you a link to reset your password.
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
                      className="w-full rounded-xl border border-white/10 bg-[#06080d] pl-12 pr-4 py-4 outline-none transition-colors focus:border-sky-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f6df6] to-[#2452d9] py-4 font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
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
                <p className="text-zinc-400">
                  Remember your password?{' '}
                  <Link href="/login" className="font-semibold text-sky-300 transition-colors hover:text-sky-200">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="mt-6 rounded-xl border border-sky-500/20 bg-sky-500/10 p-4">
                <p className="text-center text-sm text-sky-300">
                  <Mail className="inline mr-2" size={16} />
                  Reset emails are sent from <span className="font-semibold">support@wilderbots.com</span>
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </PublicPageShell>
  )
}
