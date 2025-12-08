import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Menu, X, LogIn, User, LogOut } from 'lucide-react'
import Logo from './Logo'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'

export default function Navigation() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    // If not on home page, navigate to home page first (without query params)
    if (router.pathname !== '/') {
      // Use replace to ensure clean navigation
      router.replace(`/#${id}`)
      // Wait for page to load, then scroll
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 300)
    } else {
      // If on home page but view is not landing, reset to landing first
      if (router.query.view && (router.query.view === 'devkit' || router.query.view === 'order')) {
        // Explicitly navigate to home without query params
        router.replace('/' + (id ? `#${id}` : ''), undefined, { shallow: true })
        setTimeout(() => {
          const element = document.getElementById(id)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 150)
      } else {
        // Already on landing page, just scroll
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
          setMobileMenuOpen(false)
        }
      }
    }
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Logo 
          size={60} 
          showText={true}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('products')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">The Kit</button>
          <button onClick={() => scrollToSection('education')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Education</button>
          <Link href="/services" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Services</Link>
          <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">About Us</Link>
          <Link href="/careers" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Careers</Link>
          <Link href="/contact" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Contact</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="px-5 py-2 bg-purple-600 text-white text-sm font-bold rounded-full hover:bg-purple-700 transition-all transform hover:scale-105 flex items-center gap-2">
                <User size={18} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="px-5 py-2 bg-red-600 text-white text-sm font-bold rounded-full hover:bg-red-700 transition-all transform hover:scale-105 flex items-center gap-2">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="px-5 py-2 bg-purple-600 text-white text-sm font-bold rounded-full hover:bg-purple-700 transition-all transform hover:scale-105 flex items-center gap-2">
              <LogIn size={18} /> Login
            </Link>
          )}
          <a href="https://neureck.com" target="_blank" rel="noopener noreferrer" className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105">
            Launch Neureck
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-6 z-50" role="menu" aria-label="Mobile navigation menu">
          <button onClick={() => scrollToSection('products')} className="text-lg font-medium text-left">The Kit</button>
          <button onClick={() => scrollToSection('education')} className="text-lg font-medium text-left">Education</button>
          <Link href="/services" className="text-lg font-medium text-left">Services</Link>
          <Link href="/about" className="text-lg font-medium text-left">About Us</Link>
          <Link href="/careers" className="text-lg font-medium text-left">Careers</Link>
          <Link href="/contact" className="text-lg font-medium text-left">Contact</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="w-full py-3 bg-purple-600 text-white text-center font-bold rounded-full flex items-center justify-center gap-2">
                <User size={18} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="w-full py-3 bg-red-600 text-white text-center font-bold rounded-full flex items-center justify-center gap-2">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="w-full py-3 bg-purple-600 text-white text-center font-bold rounded-full flex items-center justify-center gap-2">
              <LogIn size={18} /> Login
            </Link>
          )}
          <a href="https://neureck.com" target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-white text-black text-center font-bold rounded-full">
            Launch Neureck
          </a>
        </div>
      )}
    </nav>
  )
}

