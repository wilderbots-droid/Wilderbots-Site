import { ArrowLeft, Mail, Lock, User, UserPlus, AlertCircle, Phone } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Logo from './Logo'
import { useRouter } from 'next/router'


const GitHubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

export default function SignupPage({ onBack }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOAuthLoading] = useState(null) // Track which OAuth provider is loading
  const [passwordStrength, setPasswordStrength] = useState(null)
  const { signup } = useAuth()
  const router = useRouter()

  const checkPasswordStrength = (pwd) => {
    if (!pwd) {
      setPasswordStrength(null)
      return
    }

    const strength = {
      hasUpperCase: /[A-Z]/.test(pwd),
      hasNumbers: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    }

    setPasswordStrength(strength)
  }

  const validatePassword = (pwd) => {
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    const hasCapitalLetter = /[A-Z]/.test(pwd)
    const hasNumber = /[0-9]/.test(pwd)
    const hasMinLength = pwd.length >= 6

    if (!hasMinLength) {
      return { valid: false, message: 'Password must be at least 6 characters' }
    }
    if (!hasCapitalLetter) {
      return { valid: false, message: 'Password must contain at least one capital letter' }
    }
    if (!hasNumber) {
      return { valid: false, message: 'Password must contain at least one number' }
    }
    if (!hasSpecialChar) {
      return { valid: false, message: 'Password must contain at least one special character' }
    }

    return { valid: true, message: '' }
  }

  const validateMobile = (mobileNumber) => {
    const mobileRegex = /^[0-9]{10}$/
    if (!mobileRegex.test(mobileNumber)) {
      return { valid: false, message: 'Mobile number must be exactly 10 digits' }
    }
    return { valid: true, message: '' }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !mobile || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    const mobileValidation = validateMobile(mobile)
    if (!mobileValidation.valid) {
      setError(mobileValidation.message)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setError(passwordValidation.message)
      return
    }

    setLoading(true)

    try {
      await signup(name, email, password, mobile)
      // Redirect to home page
      router.push('/')
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignup = async (provider) => {
    window.location.href = `/api/auth/oauth?provider=${provider}&type=signup`
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
          <span className="font-bold">Sign Up</span>
        </div>
        <div className="w-16"></div>
      </div>

      {/* Signup Form */}
      <section className="py-24 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Wilderbots</h1>
            <p className="text-gray-400">Create an account to track orders and access exclusive content</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:border-purple-500 outline-none transition-colors"
                  placeholder="Enter your name"
                />
              </div>
            </div>

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
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium mb-2">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  id="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                  maxLength={10}
                  className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:border-purple-500 outline-none transition-colors"
                  placeholder="Enter your number"
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
                  onChange={(e) => {
                    setPassword(e.target.value)
                    checkPasswordStrength(e.target.value)
                  }}
                  required
                  minLength={6}
                  className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:border-purple-500 outline-none transition-colors"
                  placeholder="At least 6 characters"
                />
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-gray-400">Password must contain:</div>
                  <div className="flex flex-wrap gap-2">
                    <div className={`text-xs px-2 py-1 rounded ${passwordStrength?.hasUpperCase ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'}`}>
                      {passwordStrength?.hasUpperCase ? '✓' : '✗'} Uppercase letter
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${passwordStrength?.hasNumbers ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'}`}>
                      {passwordStrength?.hasNumbers ? '✓' : '✗'} Number
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${passwordStrength?.hasSpecialChar ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'}`}>
                      {passwordStrength?.hasSpecialChar ? '✓' : '✗'} Special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:border-purple-500 outline-none transition-colors"
                  placeholder="Confirm your password"
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Account <UserPlus size={18} />
                </>
              )}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-400">Or sign up with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={() => handleOAuthSignup('github')}
                disabled={oauthLoading !== null}
                title="Sign up with GitHub"
                className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl py-4 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/10"
              >
                <GitHubIcon />
                <span className="font-semibold">Continue with GitHub</span>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

