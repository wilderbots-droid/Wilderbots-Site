import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Code, Smartphone, Bot, GraduationCap, Package, Briefcase, Heart, Zap, Users, Globe, Coffee, TrendingUp, Award, Clock, X, Upload, FileText, Mail, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import PublicPageShell from './PublicPageShell'

function MobileSnapCarousel({ items, activeIndex, setActiveIndex, renderItem, itemKey }) {
  const containerRef = useRef(null)

  const handleScroll = (event) => {
    const { scrollLeft, clientWidth } = event.currentTarget
    if (!clientWidth) return
    const nextIndex = Math.round(scrollLeft / clientWidth)
    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex)
    }
  }

  const scrollToIndex = (index) => {
    if (!containerRef.current) return
    containerRef.current.scrollTo({
      left: containerRef.current.clientWidth * index,
      behavior: 'smooth'
    })
    setActiveIndex(index)
  }

  return (
    <>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory items-stretch overflow-x-auto overflow-y-hidden px-6 touch-pan-x md:hidden"
      >
        {items.map((item, index) => (
          <div key={itemKey(item, index)} className="flex w-full shrink-0 snap-center">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {items.length > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-2 md:hidden">
          {items.map((item, index) => (
            <button
              key={`${itemKey(item, index)}-dot`}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index ? 'w-6 bg-sky-400' : 'w-2.5 bg-white/20'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </>
  )
}

export default function CareersPage({ onBack }) {
  const [openPositions, setOpenPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [emailAddresses, setEmailAddresses] = useState([])
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    resume: null,
    coverLetter: '',
    portfolio: '',
    linkedin: '',
    github: '',
    experience: '',
    whyWilderbots: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [valuesIndex, setValuesIndex] = useState(0)
  const [benefitsIndex, setBenefitsIndex] = useState(0)

  useEffect(() => {
    fetchCareers()
    fetchEmailAddresses()
  }, [])

  const fetchCareers = async () => {
    try {
      const response = await fetch('/api/careers')
      if (response.ok) {
        const data = await response.json()
        setOpenPositions(data.careers || [])
      }
    } catch (error) {
      console.error('Error fetching careers:', error)
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

  const getCareerEmail = () => {
    // Priority: career purpose > general/info > primary > first active
    const careerEmail = emailAddresses.find(ea => ea.purpose === 'career') ||
                       emailAddresses.find(ea => ea.purpose === 'general' || ea.purpose === 'info') ||
                       emailAddresses.find(ea => ea.isPrimary) ||
                       emailAddresses[0]
    
    return careerEmail?.email || 'careers@wilderbots.com'
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0]
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    console.log('Form submitted', formData)
    setIsSubmitting(true)
    setSubmitStatus(null)

    // Client-side validation
    const missingFields = []
    if (!formData.name || formData.name.trim() === '') missingFields.push('Name')
    if (!formData.email || formData.email.trim() === '') missingFields.push('Email')
    if (!formData.position || formData.position.trim() === '') missingFields.push('Position')
    if (!formData.experience || formData.experience.trim() === '') missingFields.push('Years of Experience')
    if (!formData.whyWilderbots || formData.whyWilderbots.trim() === '') missingFields.push('Why Wilderbots')

    if (missingFields.length > 0) {
      setIsSubmitting(false)
      setSubmitStatus('error')
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`)
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setIsSubmitting(false)
      setSubmitStatus('error')
      alert('Please enter a valid email address')
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
      return
    }

    try {
      const requestBody = {
        careerId: selectedPosition?._id || null,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || '',
        position: formData.position.trim(),
        coverLetter: formData.coverLetter?.trim() || '',
        portfolio: formData.portfolio?.trim() || '',
        linkedin: formData.linkedin?.trim() || '',
        github: formData.github?.trim() || '',
        experience: formData.experience.trim(),
        whyWilderbots: formData.whyWilderbots.trim()
      }

      const response = await fetch('/api/job-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitting(false)
        setSubmitStatus('success')
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          position: '',
          resume: null,
          coverLetter: '',
          portfolio: '',
          linkedin: '',
          github: '',
          experience: '',
          whyWilderbots: ''
        })
        
        // Close form after 3 seconds
        setTimeout(() => {
          setSelectedPosition(null)
          setSubmitStatus(null)
        }, 3000)
      } else {
        setIsSubmitting(false)
        setSubmitStatus('error')
        const errorMessage = data.error || data.message || 'Failed to submit application. Please try again.'
        alert(errorMessage)
        console.error('Job application API error:', data)
        setTimeout(() => {
          setSubmitStatus(null)
        }, 5000)
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      setIsSubmitting(false)
      setSubmitStatus('error')
      alert(`Network error: ${error.message}. Please check your connection and try again.`)
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
    }
  }

  const openApplicationForm = (position) => {
    setFormData({
      ...formData,
      position: position.title,
      name: '',
      email: ''
    })
    setSelectedPosition(position)
    setSubmitStatus(null)
  }

  const closeForm = () => {
    setSelectedPosition(null)
    setSubmitStatus(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      resume: null,
      coverLetter: '',
      portfolio: '',
      linkedin: '',
      github: '',
      experience: '',
      whyWilderbots: ''
    })
  }

  const benefits = [
    {
      icon: Zap,
      title: "Flexible Work",
      description: "Remote-first culture with flexible hours and hybrid options"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Continuous learning opportunities and clear advancement paths"
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs"
    },
    {
      icon: Award,
      title: "Competitive Pay",
      description: "Market-leading salaries with equity and performance bonuses"
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Work with passionate, talented people who care about impact"
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Build products that reach 50k+ users across 35 countries"
    }
  ]

  const values = [
    {
      icon: Code,
      title: "Innovation First",
      description: "We push boundaries and embrace cutting-edge technology"
    },
    {
      icon: GraduationCap,
      title: "Education Matters",
      description: "We believe in making technology accessible to everyone"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Great products come from great teams working together"
    },
    {
      icon: Heart,
      title: "Work-Life Balance",
      description: "We value your well-being and personal growth"
    }
  ]

  return (
    <PublicPageShell
      onBack={onBack}
      eyebrow="Careers"
      title={
        <>
          Build the future
          <span className="block bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text italic text-transparent">
            with Wilderbots
          </span>
        </>
      }
      description="Join a team building AI systems, education experiences, and digital products that solve real problems for real teams."
      contentClassName="space-y-8"
    >

      {/* Why Work Here */}
      <section className="border-t border-white/5 bg-neutral-900 px-5 py-10 md:px-6 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-8 text-center text-3xl font-bold md:mb-12 md:text-5xl">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Wilderbots?</span>
          </h2>
          <MobileSnapCarousel
            items={values}
            activeIndex={valuesIndex}
            setActiveIndex={setValuesIndex}
            itemKey={(value, index) => `${value.title}-${index}`}
            renderItem={(value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="mr-5 flex w-full flex-col rounded-2xl border border-white/10 bg-black p-6 transition-all hover:border-purple-500/50"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                    <Icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{value.title}</h3>
                  <p className="text-sm text-gray-400">{value.description}</p>
                </motion.div>
              )
            }}
          />
          <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-black p-6 transition-all hover:border-purple-500/50"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                    <Icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{value.title}</h3>
                  <p className="text-sm text-gray-400">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-white/10 bg-black px-5 py-10 md:px-6 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-3 text-center text-3xl font-bold md:mb-4 md:text-5xl">Benefits & Perks</h2>
          <p className="mb-8 text-center text-base text-gray-400 md:mb-12 md:text-lg">We take care of our team</p>
          <MobileSnapCarousel
            items={benefits}
            activeIndex={benefitsIndex}
            setActiveIndex={setBenefitsIndex}
            itemKey={(benefit, index) => `${benefit.title}-${index}`}
            renderItem={(benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                  className="mr-5 flex w-full flex-col rounded-2xl border border-white/10 bg-neutral-900 p-6 transition-all hover:border-blue-500/50"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{benefit.title}</h3>
                  <p className="text-sm text-gray-400">{benefit.description}</p>
                </motion.div>
              )
            }}
          />
          <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-neutral-900 p-6 transition-all hover:border-blue-500/50"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{benefit.title}</h3>
                  <p className="text-sm text-gray-400">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="border-t border-white/5 bg-neutral-900 px-5 py-10 md:px-6 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center md:mb-12">
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">Open Positions</h2>
            <p className="text-base text-gray-400 md:text-lg">Join us in building the next generation of technology</p>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading positions...</div>
          ) : openPositions.length > 0 ? (
            <div className="space-y-4">
              {openPositions.map((position, index) => (
                <motion.div
                  key={position._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="group rounded-2xl border border-white/10 bg-black p-5 transition-all hover:border-purple-500/50 md:p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold md:text-2xl">{position.title}</h3>
                        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold rounded-full">
                          {position.department}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {position.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe size={14} /> {position.location}
                        </span>
                      </div>
                      <p className="mb-4 text-gray-300">{position.description}</p>
                      {position.requirements && position.requirements.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {position.requirements.map((req, i) => (
                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
                              {req}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => openApplicationForm(position)}
                      className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap"
                      aria-label={`Apply for ${position.title}`}
                    >
                      Apply Now <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">No open positions at the moment. Check back soon!</div>
          )}
        </div>
      </section>

      {/* Don't See Your Role */}
      <section className="border-t border-white/10 bg-black px-5 py-10 md:px-6 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-5 text-3xl font-bold md:mb-6 md:text-5xl">Don&apos;t See Your Role?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400 md:mb-10 md:text-xl">
            We&apos;re always looking for talented individuals. Even if you don&apos;t see a perfect match, we&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => openApplicationForm({ title: 'General Application', department: 'General' })}
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              Send Us Your Resume <ArrowRight size={18} />
            </button>
            <Link
              href="/contact"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2"
            >
              Get in Touch
            </Link>
          </div>
          
          {/* Career Email Contact */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-gray-400 mb-4">Have questions about careers or want to reach out directly?</p>
            <a
              href={`mailto:${getCareerEmail()}?subject=Career Inquiry`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full hover:bg-purple-500/20 transition-all"
            >
              <Mail size={18} />
              {getCareerEmail()}
            </a>
          </div>
        </div>
      </section>

      {/* Application Form Modal */}
      {selectedPosition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-black border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-black border-b border-white/10 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Apply for {selectedPosition?.title || 'Position'}</h2>
                <p className="text-sm text-gray-400">{selectedPosition?.department || 'General Application'}</p>
              </div>
              <button
                onClick={closeForm}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
              {submitStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="text-green-400 rotate-[-45deg]" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
                  <p className="text-gray-400">We&apos;ll review your application and get back to you soon.</p>
                </div>
              ) : (
                <>
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b border-white/10 pb-2">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Position *</label>
                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          readOnly
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Resume/CV (Optional)</label>
                    <label className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Upload size={20} className="text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {formData.resume ? formData.resume.name : 'Upload your resume (PDF, DOC, DOCX)'}
                        </p>
                        <p className="text-xs text-gray-400">Max file size: 5MB (Note: File upload will be implemented soon)</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Professional Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b border-white/10 pb-2">Professional Links</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">LinkedIn</label>
                        <input
                          type="url"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">GitHub</label>
                        <input
                          type="url"
                          name="github"
                          value={formData.github}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="https://github.com/yourusername"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Portfolio/Website</label>
                        <input
                          type="url"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Experience *</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="e.g., 5 years"
                    />
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Cover Letter</label>
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors resize-none"
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                    />
                  </div>

                  {/* Why Wilderbots */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Why do you want to work at Wilderbots? *</label>
                    <textarea
                      name="whyWilderbots"
                      value={formData.whyWilderbots}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors resize-none"
                      placeholder="Share what excites you about our mission and values..."
                    />
                  </div>

                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                      Failed to submit application. Please check all required fields and try again.
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="flex-1 px-6 py-3 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={(e) => {
                        console.log('Submit button clicked')
                        if (!formData.name || !formData.email || !formData.position || !formData.experience || !formData.whyWilderbots) {
                          console.log('Missing fields:', {
                            name: formData.name,
                            email: formData.email,
                            position: formData.position,
                            experience: formData.experience,
                            whyWilderbots: formData.whyWilderbots
                          })
                        }
                      }}
                      className="flex-1 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </PublicPageShell>
  )
}
