import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Code, Smartphone, Bot, GraduationCap, Package, Briefcase, Heart, Zap, Users, Globe, Coffee, TrendingUp, Award, Clock, X, Upload, FileText, Mail, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Logo from './Logo'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/router'

export default function CareersPage({ onBack }) {
  const { user } = useAuth()
  const router = useRouter()
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
    
    // Check if user is logged in
    if (!user) {
      alert('Please login to submit your application.')
      router.push('/login?redirect=/careers')
      return
    }
    
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
      const token = localStorage.getItem('wilderbots_token')
      const headers = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

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

      console.log('Submitting application:', requestBody)

      const response = await fetch('/api/job-application', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      })

      console.log('Response status:', response.status)

      const data = await response.json()
      console.log('Response data:', data)

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
        console.error('API Error Response:', data)
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
    // Check if user is logged in
    if (!user) {
      alert('Please login to apply for this position.')
      router.push('/login?redirect=/careers')
      return
    }
    
    setFormData({
      ...formData,
      position: position.title,
      name: user?.name || '',
      email: user?.email || ''
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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-white/10 p-6 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-2">
          <Logo size={35} showText={false} />
          <span className="font-bold">Careers</span>
        </div>
        <div className="w-16"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-3xl"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold tracking-wider text-xs uppercase">
            <Users size={14} /> Join Our Team
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Future.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Join a team that's revolutionizing wearable tech, education, and digital innovation. Work on meaningful projects that impact thousands of users worldwide.
          </p>
        </div>
      </section>

      {/* Why Work Here */}
      <section className="py-16 px-6 bg-neutral-900 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Wilderbots?</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="bg-black border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-purple-400 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-400 text-sm">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">Benefits & Perks</h2>
          <p className="text-center text-gray-400 mb-12 text-lg">We take care of our team</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="bg-neutral-900 border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-blue-400 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-6 bg-neutral-900 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Open Positions</h2>
            <p className="text-gray-400 text-lg">Join us in building the next generation of technology</p>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading positions...</div>
          ) : openPositions.length > 0 ? (
            <div className="space-y-4">
              {openPositions.map((position, index) => (
                <div key={position._id || index} className="bg-black border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">{position.title}</h3>
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
                      <p className="text-gray-300 mb-4">{position.description}</p>
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">No open positions at the moment. Check back soon!</div>
          )}
        </div>
      </section>

      {/* Don't See Your Role */}
      <section className="py-16 px-6 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Don't See Your Role?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            We're always looking for talented individuals. Even if you don't see a perfect match, we'd love to hear from you.
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
                  <p className="text-gray-400">We'll review your application and get back to you soon.</p>
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
    </div>
  )
}

