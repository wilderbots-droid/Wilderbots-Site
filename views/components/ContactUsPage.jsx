import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageSquare, Briefcase, GraduationCap, Package, Linkedin, Github, Twitter, Instagram, Youtube, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import PublicPageShell from './PublicPageShell'
import { useAuth } from '../../contexts/AuthContext'

const DEFAULT_MAP_URL = 'https://www.google.com/maps/place/WILDERBOTS+TECHNOLOGIES+PRIVATE+LIMITED/data=!4m2!3m1!1s0x3bae1707ff3e16a3:0x2e482c0f5dfa5a53?hl=en&trk=https%3A%2F%2Fc.gle%2FAOExmq1S2OsXyCFYzXTGVpyV32ZqWBNcFPW5PPXFO01rhc6xOueoVKv7RSbyjLPTqzIlirA_xxyyuY-yMqasamfalCKtIjQhHAemh8bsjGoQegUa8O-JMVzYGke50nkTnOxCDkc'
const DEFAULT_MAP_EMBED_URL = 'https://www.google.com/maps?q=WILDERBOTS%20TECHNOLOGIES%20PRIVATE%20LIMITED&z=15&output=embed'
const DEFAULT_COMPANY_INFO = {
  name: 'Wilderbots',
  email: 'hello@wilderbots.com',
  phone: '+1 (555) 123-4567',
  mapUrl: DEFAULT_MAP_URL,
  mapEmbedUrl: DEFAULT_MAP_EMBED_URL,
  timezone: 'Pacific Standard Time',
  departments: [],
  socialMedia: {}
}
const DEFAULT_EMAIL_ADDRESS = {
  label: 'General inquiries',
  email: 'hello@wilderbots.com',
  purpose: 'general',
  description: 'General inquiries',
  isPrimary: true
}

const iconMap = {
  Package,
  Briefcase,
  GraduationCap,
  MessageSquare
}

export default function ContactUsPage({ onBack }) {
  const { user } = useAuth()
  const [companyInfo, setCompanyInfo] = useState(DEFAULT_COMPANY_INFO)
  const [emailAddresses, setEmailAddresses] = useState([])
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
      setFormData((current) => ({
        ...current,
        name: user.name || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch('/api/company-info', {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setCompanyInfo(data.companyInfo || DEFAULT_COMPANY_INFO)
      }
    } catch (error) {
      console.error('Error fetching company info:', error)
    }
  }

  const fetchEmailAddresses = async () => {
    try {
      const response = await fetch('/api/email-addresses', {
        cache: 'no-store'
      })
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

      if (response.ok || response.status === 201) {
        setSubmitStatus('success')
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          subject: '',
          category: 'general',
          message: ''
        })
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null)
        }, 5000)
      } else {
        console.error('Contact submission failed:', response.status, data)
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

  const getMapLink = () => {
    return companyInfo?.mapUrl || DEFAULT_COMPANY_INFO.mapUrl
  }

  const getMapEmbedLink = () => {
    return companyInfo?.mapEmbedUrl || DEFAULT_COMPANY_INFO.mapEmbedUrl
  }

  const getContactInfo = () => {
    // Get primary email or first active email
    const primaryEmail = emailAddresses.find((ea) => ea.isPrimary) || emailAddresses[0] || DEFAULT_EMAIL_ADDRESS
    const displayEmail = primaryEmail.email || companyInfo.email || DEFAULT_COMPANY_INFO.email
    
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
        value: companyInfo.phone || DEFAULT_COMPANY_INFO.phone,
        link: `tel:${companyInfo.phone?.replace(/\D/g, '') || '15551234567'}`,
        description: "Mon-Fri, 9AM-6PM EST"
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

    // Priority 1: Use company info departments if configured
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

    // Priority 2: Fallback to managed email addresses
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

    // Default fallback
    const primaryEmail = emailAddresses.find((ea) => ea.isPrimary) || emailAddresses[0] || DEFAULT_EMAIL_ADDRESS
    const defaultEmail = primaryEmail.email || companyInfo.email || DEFAULT_COMPANY_INFO.email
    
    return [
      {
        icon: Package,
        title: "Product Support",
        email: emailAddresses.find(ea => ea.purpose === 'support')?.email || defaultEmail,
        description: "Questions about delivery, support, or current Wilderbots offerings"
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
    <PublicPageShell
      onBack={onBack}
      eyebrow="Contact Wilderbots"
      title={
        <>
          Start the conversation
          <span className="block bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text italic text-transparent">
            around your next build
          </span>
        </>
      }
      description="Whether you need application development, web delivery, education support, or a direct project conversation, this page now follows the same darker glass system as the homepage."
      contentClassName="space-y-8"
    >
      <section className="rounded-[2rem] border border-white/10 bg-zinc-950/35 px-6 py-12 backdrop-blur-xl md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid items-stretch gap-8 lg:grid-cols-2 xl:gap-10">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex h-full flex-col rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,38,0.88)_0%,rgba(8,11,18,0.96)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
                <div className="mb-8">
                  <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">Direct message</p>
                  <h2 className="mt-3 font-serif-custom text-3xl font-normal text-white">Send us a Message</h2>
                  <p className="mt-3 max-w-xl text-zinc-400">
                    Tell us what you&apos;re building, what you need help with, or where you want to collaborate.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-300">Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#06080d] px-4 py-3 text-white outline-none transition-colors focus:border-sky-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#06080d] px-4 py-3 text-white outline-none transition-colors focus:border-sky-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="category" className="mb-2 block text-sm font-medium text-zinc-300">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-white/10 bg-[#06080d] px-4 py-3 text-white outline-none transition-colors focus:border-sky-500"
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
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-zinc-300">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-white/10 bg-[#06080d] px-4 py-3 text-white outline-none transition-colors focus:border-sky-500"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-zinc-300">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={7}
                      className="w-full resize-none rounded-xl border border-white/10 bg-[#06080d] px-4 py-3 text-white outline-none transition-colors focus:border-sky-500"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  {submitStatus === 'success' && (
                    <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">
                      Thank you! Your message has been sent. We&apos;ll get back to you soon.
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
                      There was an error sending your message. Please try again later.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f6df6] to-[#2452d9] py-4 font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>Sending... <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div></>
                    ) : (
                      <>Send Message <Send size={18} /></>
                    )}
                  </button>
                </form>
                <div className="mt-6 border-t border-white/10 pt-5 text-sm text-zinc-500">
                  Most inquiries get a response within 1 to 2 business days.
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="h-full"
            >
              <div className="flex h-full flex-col rounded-[28px] border border-white/10 bg-black/30 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">Reach us</p>
                  <h2 className="mt-3 font-serif-custom text-3xl font-normal text-white">Get in Touch</h2>
                  <p className="mt-3 max-w-lg text-zinc-400">
                    Prefer email, a quick call, or directions to the office? Everything you need is organized here.
                  </p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {getContactInfo().map((info, index) => (
                    <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10">
                        <info.icon className="h-5 w-5 text-sky-300" />
                      </div>
                      <h3 className="font-bold text-white">{info.label}</h3>
                      {info.link ? (
                        <a href={info.link} className="mt-2 block break-words text-zinc-200 transition-colors hover:text-white">
                          {info.value}
                        </a>
                      ) : (
                        <p className="mt-2 text-zinc-200">{info.value}</p>
                      )}
                      <p className="mt-2 text-sm text-zinc-500">{info.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-1 flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#06080d]">
                  <div className="relative min-h-[280px] flex-1 overflow-hidden">
                    <iframe
                      title="Wilderbots location map"
                      src={getMapEmbedLink()}
                      className="h-full w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <a
                      href={getMapLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/75 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/90"
                    >
                      Open Map
                      <ExternalLink className="h-4 w-4 text-sky-300 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                  <a
                    href={getMapLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border-t border-white/10 px-6 py-5 transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Visit us</p>
                        <h3 className="mt-3 font-serif-custom text-2xl font-normal text-white">Map View</h3>
                        <p className="mt-2 max-w-md text-zinc-300">
                          Open the Wilderbots location in your preferred maps app.
                        </p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10">
                        <MapPin className="h-5 w-5 text-sky-300" />
                      </div>
                    </div>
                  </a>
                </div>

                {/* Social Links */}
                {companyInfo?.socialMedia && Object.values(companyInfo.socialMedia).some(url => url) && (
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <h3 className="mb-2 text-xl font-semibold text-white">Follow Us</h3>
                    <p className="mb-6 text-zinc-400">Keep up with launches, updates, and what the team is building next.</p>
                    <div className="flex gap-4 flex-wrap">
                      {companyInfo.socialMedia.linkedin && (
                        <a
                          href={companyInfo.socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                        >
                          <Linkedin size={20} className="text-zinc-400" />
                        </a>
                      )}
                      {companyInfo.socialMedia.github && (
                        <a
                          href={companyInfo.socialMedia.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                        >
                          <Github size={20} className="text-zinc-400" />
                        </a>
                      )}
                      {companyInfo.socialMedia.twitter && (
                        <a
                          href={companyInfo.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                        >
                          <Twitter size={20} className="text-zinc-400" />
                        </a>
                      )}
                      {companyInfo.socialMedia.instagram && (
                        <a
                          href={companyInfo.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                        >
                          <Instagram size={20} className="text-zinc-400" />
                        </a>
                      )}
                      {companyInfo.socialMedia.youtube && (
                        <a
                          href={companyInfo.socialMedia.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                        >
                          <Youtube size={20} className="text-zinc-400" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="rounded-[2rem] border border-white/10 bg-black/30 px-6 py-16 backdrop-blur-xl md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4 font-serif-custom text-4xl font-normal text-white md:text-5xl">Contact by Department</h2>
            <p className="text-xl text-zinc-400">Reach out to the right team for faster response</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {getDepartments().map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
                className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,38,0.88)_0%,rgba(8,11,18,0.96)_100%)] p-8 transition-all hover:border-white/20"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10">
                  <dept.icon className="h-8 w-8 text-sky-300" />
                </div>
                <h3 className="mb-2 font-serif-custom text-2xl font-normal text-white">{dept.title}</h3>
                <p className="mb-4 text-zinc-400">{dept.description}</p>
                <a
                  href={`mailto:${dept.email}`}
                  className="flex items-center gap-2 font-semibold text-sky-300 transition-colors hover:text-sky-200"
                >
                  <Mail size={16} />
                  {dept.email}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ CTA Section */}
      <section className="rounded-[2rem] border border-white/10 bg-zinc-950/35 px-6 py-16 text-center backdrop-blur-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6 font-serif-custom text-4xl font-normal text-white md:text-5xl">Have Questions?</h2>
          <p className="mb-10 text-xl text-zinc-400">
            Check out our FAQ section for quick answers to common questions.
          </p>
          <div className="flex justify-center">
            <Link
              href="/faq"
              className="rounded-full bg-gradient-to-r from-[#2f6df6] to-[#2452d9] px-8 py-4 font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-transform hover:scale-[1.01]"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>
    </PublicPageShell>
  )
}
