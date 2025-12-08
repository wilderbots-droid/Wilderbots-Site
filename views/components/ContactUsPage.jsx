import { useState, useEffect } from 'react'
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageSquare, Briefcase, GraduationCap, Package, Linkedin, Github, Twitter, Instagram, Youtube } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../../contexts/AuthContext'

const iconMap = {
  Package,
  Briefcase,
  GraduationCap,
  MessageSquare
}

export default function ContactUsPage({ onBack }) {
  const { user } = useAuth()
  const [companyInfo, setCompanyInfo] = useState(null)
  const [emailAddresses, setEmailAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  useEffect(() => {
    fetchCompanyInfo()
    fetchEmailAddresses()
    if (user) {
      setFormData({
        ...formData,
        name: user.name || '',
        email: user.email || ''
      })
    }
  }, [user])

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch('/api/company-info')
      if (response.ok) {
        const data = await response.json()
        setCompanyInfo(data.companyInfo)
      }
    } catch (error) {
      console.error('Error fetching company info:', error)
    } finally {
      setLoading(false)
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const token = localStorage.getItem('wilderbots_token')
      const headers = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: 'general',
          message: ''
        })
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null)
        }, 5000)
      } else {
        setSubmitStatus('error')
        setTimeout(() => {
          setSubmitStatus(null)
        }, 5000)
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitStatus('error')
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getContactInfo = () => {
    if (!companyInfo) return []
    const address = companyInfo.address
    const addressStr = address 
      ? `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
      : '123 Innovation Drive, Tech Valley, CA 94025'
    
    // Get primary email or first active email
    const primaryEmail = emailAddresses.find(ea => ea.isPrimary) || emailAddresses[0]
    const displayEmail = primaryEmail?.email || companyInfo.email || "hello@wilderbots.com"
    
    return [
      {
        icon: Mail,
        label: "Email",
        value: displayEmail,
        link: `mailto:${displayEmail}`,
        description: primaryEmail?.label || "General inquiries"
      },
      {
        icon: Phone,
        label: "Phone",
        value: companyInfo.phone || "+1 (555) 123-4567",
        link: `tel:${companyInfo.phone?.replace(/\D/g, '') || '15551234567'}`,
        description: "Mon-Fri, 9AM-6PM EST"
      },
      {
        icon: MapPin,
        label: "Address",
        value: addressStr,
        link: null,
        description: "Headquarters"
      },
      {
        icon: Clock,
        label: "Business Hours",
        value: companyInfo.businessHours || "Monday - Friday: 9:00 AM - 6:00 PM",
        link: null,
        description: companyInfo.timezone || "Pacific Standard Time"
      }
    ]
  }

  const getDepartments = () => {
    // Map purposes to icons
    const purposeIconMap = {
      support: Package,
      sales: Briefcase,
      marketing: MessageSquare,
      technical: GraduationCap,
      billing: Briefcase,
      info: MessageSquare,
      general: MessageSquare,
      career: Briefcase,
      other: MessageSquare
    }

    // If we have managed email addresses, use them
    if (emailAddresses.length > 0) {
      return emailAddresses.map((emailAddr) => {
        const Icon = purposeIconMap[emailAddr.purpose] || MessageSquare
        return {
          icon: Icon,
          title: emailAddr.label,
          email: emailAddr.email,
          description: emailAddr.description || `Contact us for ${emailAddr.purpose} inquiries`
        }
      })
    }

    // Fallback to company info departments
    if (companyInfo && companyInfo.departments && companyInfo.departments.length > 0) {
      return companyInfo.departments.map((dept, index) => {
        const iconKeys = Object.keys(iconMap)
        const Icon = iconMap[iconKeys[index % iconKeys.length]] || Package
        return {
          icon: Icon,
          title: dept.title,
          email: dept.email,
          description: dept.description
        }
      })
    }

    // Default fallback
    const primaryEmail = emailAddresses.find(ea => ea.isPrimary) || emailAddresses[0]
    const defaultEmail = primaryEmail?.email || companyInfo?.email || "hello@wilderbots.com"
    
    return [
      {
        icon: Package,
        title: "Product Support",
        email: emailAddresses.find(ea => ea.purpose === 'support')?.email || defaultEmail,
        description: "Questions about the Wilder Watch Dev Kit, shipping, or technical support"
      },
      {
        icon: Briefcase,
        title: "Business & Services",
        email: emailAddresses.find(ea => ea.purpose === 'sales')?.email || defaultEmail,
        description: "IT services, partnerships, enterprise solutions, and B2B inquiries"
      },
      {
        icon: GraduationCap,
        title: "Education & Neureck",
        email: emailAddresses.find(ea => ea.purpose === 'technical')?.email || defaultEmail,
        description: "Neureck platform, educational partnerships, curriculum inquiries"
      },
      {
        icon: MessageSquare,
        title: "General Inquiries",
        email: defaultEmail,
        description: "Press, media, careers, or any other questions"
      }
    ]
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
          <span className="font-bold">Contact Us</span>
        </div>
        <div className="w-16"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Let's Build <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Something Together</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Whether you're interested in our products, need IT services, want to explore educational partnerships, 
              or just have a question—we're here to help. Reach out and let's start a conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-24 px-6 bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 outline-none transition-colors"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="product">Product Support</option>
                    <option value="services">IT Services</option>
                    <option value="education">Education & Neureck</option>
                    <option value="partnership">Partnership</option>
                    <option value="careers">Careers</option>
                    <option value="media">Media & Press</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 outline-none transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 outline-none transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
                    Thank you! Your message has been sent. We'll get back to you soon.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                    There was an error sending your message. Please try again later.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold py-4 rounded-full transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>Sending... <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div></>
                  ) : (
                    <>Send Message <Send size={18} /></>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-6 mb-12">
                {getContactInfo().map((info, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 flex-shrink-0">
                      <info.icon className="text-purple-400 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{info.label}</h3>
                      {info.link ? (
                        <a href={info.link} className="text-gray-300 hover:text-white transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-300">{info.value}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              {companyInfo?.socialMedia && Object.values(companyInfo.socialMedia).some(url => url) && (
                <div className="border-t border-white/10 pt-8">
                  <h3 className="font-bold mb-4">Follow Us</h3>
                  <div className="flex gap-4 flex-wrap">
                    {companyInfo.socialMedia.linkedin && (
                      <a
                        href={companyInfo.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <Linkedin size={20} className="text-gray-400" />
                      </a>
                    )}
                    {companyInfo.socialMedia.github && (
                      <a
                        href={companyInfo.socialMedia.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <Github size={20} className="text-gray-400" />
                      </a>
                    )}
                    {companyInfo.socialMedia.twitter && (
                      <a
                        href={companyInfo.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <Twitter size={20} className="text-gray-400" />
                      </a>
                    )}
                    {companyInfo.socialMedia.instagram && (
                      <a
                        href={companyInfo.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <Instagram size={20} className="text-gray-400" />
                      </a>
                    )}
                    {companyInfo.socialMedia.youtube && (
                      <a
                        href={companyInfo.socialMedia.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <Youtube size={20} className="text-gray-400" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Contact by Department</h2>
            <p className="text-xl text-gray-400">Reach out to the right team for faster response</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {getDepartments().map((dept, index) => (
              <div key={index} className="bg-neutral-900 rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                  <dept.icon className="text-purple-400 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{dept.title}</h3>
                <p className="text-gray-400 mb-4">{dept.description}</p>
                <a
                  href={`mailto:${dept.email}`}
                  className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2 transition-colors"
                >
                  <Mail size={16} />
                  {dept.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ CTA Section */}
      <section className="py-24 px-6 bg-neutral-900 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Have Questions?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Check out our FAQ section for quick answers to common questions.
          </p>
          <div className="flex justify-center">
            <a
              href="/faq"
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all"
            >
              View FAQ
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

