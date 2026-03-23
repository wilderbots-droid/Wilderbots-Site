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
  const [products, setProducts] = useState([])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product')
        const data = await response.json()
        if (Array.isArray(data)) {
          setProducts(data)
        }
      } catch (error) {
        console.error('Error fetching products for nav:', error)
      }
    }

    window.addEventListener('scroll', handleScroll)
    fetchProducts()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    if (router.pathname !== '/') {
      router.push(`/#${id}`)
    } else {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setMobileMenuOpen(false)
      }
    }
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Logo 
          size={60} 
          showText={true}
          onClick={() => router.push('/')}
        />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="relative group">
            <button 
              onClick={() => scrollToSection('products')}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1 py-2"
            >
              Products
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 w-64 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
              {products.map(p => (
                <Link 
                  key={p._id} 
                  href={`/products/${p._id}`}
                  className="block px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="text-sm font-bold text-white">{p.title.split(' ')[0]} {p.title.split(' ')[1]}</div>
                  <div className="text-xs text-gray-500 truncate">{p.subtitle}</div>
                </Link>
              ))}
            </div>
          </div>
          <button onClick={() => scrollToSection('education')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Education</button>
          <Link href="/services" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Services</Link>
          <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Contact</Link>
          
          {user ? (
            <Link href="/dashboard" className="px-5 py-2 bg-purple-600 text-white text-sm font-bold rounded-full hover:bg-purple-700 transition-all flex items-center gap-2">
              <User size={18} /> Dashboard
            </Link>
          ) : (
            <Link href="/login" className="px-5 py-2 bg-purple-600 text-white text-sm font-bold rounded-full hover:bg-purple-700 transition-all flex items-center gap-2">
              <LogIn size={18} /> Login
            </Link>
          )}
          <a href="https://neureck.com" target="_blank" rel="noopener noreferrer" className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-all">
            Launch Neureck
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-0 left-0 bg-black z-50 p-6 flex flex-col gap-6 pt-24">
          <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 text-white text-sm">Close</button>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Products</div>
          {products.map(p => (
            <Link 
              key={p._id} 
              href={`/products/${p._id}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-bold"
            >
              {p.title}
            </Link>
          ))}
          <div className="h-px bg-white/10 my-4"></div>
          <button onClick={() => scrollToSection('education')} className="text-lg font-medium text-left">Education</button>
          <Link href="/services" className="text-lg font-medium text-left">Services</Link>
          <Link href="/about" className="text-lg font-medium text-left">About Us</Link>
          <Link href="/contact" className="text-lg font-medium text-left">Contact</Link>
        </div>
      )}
    </nav>
  )
}

