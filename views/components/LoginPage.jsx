import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/router'
import { signInWithGooglePopup } from '../../lib/firebaseClient'
import PublicPageShell from './PublicPageShell'

// OAuth provider icons (using Unicode and SVG alternatives)

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const GitHubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

export default function LoginPage({ onBack }) {
  const [emailOrMobile, setEmailOrMobile] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOAuthLoading] = useState(null) // Track which OAuth provider is loading
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!emailOrMobile || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      await login(emailOrMobile, password)
      // Check for redirect query parameter
      const redirect = router.query.redirect
      if (redirect) {
        router.push(redirect)
      } else {
        router.push('/')
      }
    } catch (err) {
      setError(err.message || 'Invalid email/mobile or password')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider) => {
    // Prevent duplicate requests
    if (oauthLoading) return
    
    if (provider === 'firebase' || provider === 'google') {
      setOAuthLoading(provider)
      setError('')
      try {
        const { idToken } = await signInWithGooglePopup()
        const response = await fetch('/api/auth/firebase-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken, type: 'login' }),
        })
        
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Third-party sign-in failed')
        }
        
        const redirect = router.query.redirect
        if (redirect) router.push(redirect)
        else router.push('/')
      } catch (err) {
        setError(err.message || 'Popup sign-in cancelled')
        setOAuthLoading(null)
      }
    } else {
      // Redirect to OAuth login page
      window.location.href = `/api/auth/oauth?provider=${provider}&type=login`
    }
  }

  return (
    <PublicPageShell
      onBack={onBack}
      eyebrow="Account Access"
      title={<>Welcome back to<span className="block bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text italic text-transparent">Wilderbots</span></>}
      description="Sign in to manage your account, review project details, and continue from where you left off."
    >
      <section className="rounded-[2rem] border border-white/10 bg-zinc-950/35 px-6 py-12 backdrop-blur-xl">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4 font-serif-custom text-4xl font-normal text-white md:text-5xl">Sign in</h2>
            <p className="text-zinc-400">Track your activity and manage your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="emailOrMobile" className="block text-sm font-medium mb-2">Email or Mobile Number</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="emailOrMobile"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#06080d] pl-12 pr-4 py-4 outline-none transition-colors focus:border-sky-500"
                  placeholder="Enter your email or mobile number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#06080d] pl-12 pr-4 py-4 outline-none transition-colors focus:border-sky-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-black border-white/10" />
                <span className="text-sm text-zinc-400">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-sky-300 transition-colors hover:text-sky-200">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f6df6] to-[#2452d9] py-4 font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <LogIn size={18} />
                </>
              )}
            </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                <span className="bg-[#0b0f17] px-2 text-zinc-400">Or sign in with</span>
                </div>
              </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                disabled={oauthLoading !== null}
                title="Sign in with Google"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl py-3 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/10"
              >
                {oauthLoading === 'google' ? (
                  <div className="animate-spin"><div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full"></div></div>
                ) : (
                  <GoogleIcon />
                )}
              </button>
              <button
                type="button"
                onClick={() => handleOAuthLogin('github')}
                disabled={oauthLoading !== null}
                title="Sign in with GitHub"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl py-3 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/10"
              >
                <GitHubIcon />
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-zinc-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-sky-300 transition-colors hover:text-sky-200">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PublicPageShell>
  )
}
