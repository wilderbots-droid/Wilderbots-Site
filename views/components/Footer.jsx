import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Github, Linkedin, Twitter, Mail, Instagram, Youtube } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  const router = useRouter()
  const [companyInfo, setCompanyInfo] = useState(null)
  const [emailAddresses, setEmailAddresses] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchCompanyInfo()
    fetchEmailAddresses()
    fetchProducts()
  }, [])

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch('/api/company-info')
      if (response.ok) {
        const data = await response.json()
        setCompanyInfo(data.companyInfo)
      }
    } catch (error) {
      console.error('Error fetching company info:', error)
    }
  }

  const fetchEmailAddresses = async () => {
    try {
      const response = await fetch('/api/email-addresses')
      if (response.ok) {
        const data = await response.json()
        setEmailAddresses(data.emailAddresses || [])
      }
    } catch (error) {
      console.error('Error fetching email addresses:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/product')
      if (response.ok) {
        const data = await response.json()
        setProducts(data || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const scrollToSection = (id) => {
    // If not on home page, navigate to home page first (without query params)
    if (router.pathname !== '/') {
      router.push(`/#${id}`)
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
        router.replace(`/#${id}`, undefined, { shallow: true })
        setTimeout(() => {
          const element = document.getElementById(id)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      } else {
        // Already on landing page, just scroll
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  const socialMedia = companyInfo?.socialMedia || {}
  // Get primary email or first active email, fallback to company info email
  const primaryEmail = emailAddresses.find(ea => ea.isPrimary) || emailAddresses[0]
  const email = primaryEmail?.email || companyInfo?.email || 'hello@wilderbots.com'

  return (
    <footer className="bg-black py-12 px-6 border-t border-white/10 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-4">
            <Logo size={55} showText={true} />
          </div>
          <p className="text-gray-500 mb-4">
            Innovating at the intersection of hardware, software, and education. 
            Product. Service. Education.
          </p>
          <div className="flex gap-4 flex-wrap">
            {socialMedia.linkedin && (
              <a
                href={socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
              >
                <Linkedin size={18} className="text-gray-400" />
              </a>
            )}
            {socialMedia.github && (
              <a
                href={socialMedia.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
              >
                <Github size={18} className="text-gray-400" />
              </a>
            )}
            {socialMedia.twitter && (
              <a
                href={socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
              >
                <Twitter size={18} className="text-gray-400" />
              </a>
            )}
            {socialMedia.instagram && (
              <a
                href={socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
              >
                <Instagram size={18} className="text-gray-400" />
              </a>
            )}
            {socialMedia.youtube && (
              <a
                href={socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
              >
                <Youtube size={18} className="text-gray-400" />
              </a>
            )}
            <a
              href={`mailto:${email}`}
              className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
            >
              <Mail size={18} className="text-gray-400" />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Product</h4>
          <ul className="space-y-2 text-gray-500">
            {products.map(product => (
              <li key={product._id}>
                <a href={`/products/${product._id}`} className="hover:text-white transition-colors text-left block">
                  {product.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Services</h4>
          <ul className="space-y-2 text-gray-500">
            <li>
              <a href="/services" className="hover:text-white transition-colors">
                All Services
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-white transition-colors">
                App Development
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-white transition-colors">
                Web Development
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-white transition-colors">
                AI Solutions
              </a>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-500">
            <li>
              <a href="/about" className="hover:text-white transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="/careers" className="hover:text-white transition-colors">
                Careers
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition-colors">
                Contact
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-white transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="https://neureck.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Neureck Platform
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-600 pt-8 border-t border-white/5">
        <p>© 2025 Wilderbots Technologies Private Limited. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0 flex-wrap">
          <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="/returns" className="hover:text-white transition-colors">Returns & Delivery</a>
          <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
      </div>
    </footer>
  )
}
