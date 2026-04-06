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

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-xl z-[60] flex flex-col p-6 overflow-y-auto"
          >
            {/* Header in Menu */}
            <div className="flex justify-between items-center mb-12">
              <Logo size={50} showText={true} onClick={() => { router.push('/'); setMobileMenuOpen(false); }} />
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col gap-8 flex-1">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-2">Products</p>
                <div className="grid grid-cols-1 gap-2">
                  {products.map((p, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      key={p._id}
                    >
                      <Link 
                        href={`/products/${p._id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors"
                      >
                        <span className="text-lg font-bold text-white">{p.title}</span>
                        <span className="text-xs text-gray-500 truncate">{p.subtitle}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-4">
                {[
                  { name: 'Services', href: '/services' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Contact', href: '/contact' },
                  { name: 'Education', action: () => scrollToSection('education') }
                ].map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    key={item.name}
                  >
                    {item.href ? (
                      <Link 
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-3xl font-bold text-white pl-2"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <button 
                        onClick={item.action}
                        className="text-3xl font-bold text-white pl-2 text-left w-full"
                      >
                        {item.name}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-8 border-t border-white/10 space-y-8">
              <div className="flex flex-col gap-4">
                <a 
                  href="https://neureck.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 text-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 transition-transform"
                >
                  Launch Neureck <ArrowRight size={20} />
                </a>
                {!user ? (
                  <Link 
                    href="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-4 bg-purple-600/20 text-purple-400 font-bold rounded-2xl border border-purple-500/30 flex items-center justify-center gap-2 text-lg"
                  >
                    <LogIn size={20} /> Customer Login
                  </Link>
                ) : (
                  <Link 
                    href="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-4 bg-purple-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-lg"
                  >
                    <User size={20} /> Go to Dashboard
                  </Link>
                )}
              </div>

              {/* Social Links */}
              <div className="flex justify-between items-center px-2 pb-4">
                <div className="flex gap-4">
                  {companyInfo?.socialMedia?.linkedin && (
                    <a href={companyInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                      <Linkedin size={22} />
                    </a>
                  )}
                  {companyInfo?.socialMedia?.github && (
                    <a href={companyInfo.socialMedia.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                      <Github size={22} />
                    </a>
                  )}
                  {companyInfo?.socialMedia?.instagram && (
                    <a href={companyInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                      <Instagram size={22} />
                    </a>
                  )}
                  {companyInfo?.socialMedia?.twitter && (
                    <a href={companyInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                      <Twitter size={22} />
                    </a>
                  )}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">
                  Wilderbots Inc.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
