import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Code, Smartphone, Globe, Bot, Monitor, Cloud, Eye, MessageSquare, Mic, BarChart3, Box, Video, Palette, Megaphone, Layers, ArrowRight, Package } from 'lucide-react'
import Logo from './Logo'

const iconMap = {
  Smartphone,
  Globe,
  Monitor,
  Bot,
  Eye,
  Palette,
  BarChart3,
  Box,
  Video,
  Megaphone,
  Package
}

const colorMap = {
  'Application Development': 'blue',
  'Web Development': 'pink',
  'Software Development': 'purple',
  'AI & Machine Learning': 'purple',
  'Computer Vision': 'green',
  'Design Services': 'orange',
  'Data Services': 'cyan',
  '3D & Immersive Tech': 'indigo',
  'Media Production': 'red',
  'Digital Marketing': 'yellow'
}

export default function ServicesPage({ onBack }) {
  const [serviceCategories, setServiceCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        const services = (data.services || []).map(service => ({
          ...service,
          icon: iconMap[service.icon] || Package,
          color: colorMap[service.title] || 'purple',
          services: service.features || []
        }))
        setServiceCategories(services)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      // Fallback to default services if API fails
      setServiceCategories([
        {
          icon: Smartphone,
          title: "Application Development",
          color: "blue",
          services: ["iOS Development", "Android Development", "Cross-Platform Apps", "Native Mobile Solutions"]
        },
        {
          icon: Globe,
          title: "Web Development",
          color: "pink",
          services: ["Web Applications", "Website Development", "Progressive Web Apps (PWA)", "E-commerce Solutions"]
        },
        {
          icon: Bot,
          title: "AI & Machine Learning",
          color: "purple",
          services: ["LLM Finetuning", "Custom AI Models", "NLP Solutions", "Agent Chatbot Development"]
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "from-blue-500 to-cyan-500",
        shadow: "shadow-blue-500/20",
        text: "text-blue-400",
        dot: "bg-blue-500"
      },
      pink: {
        bg: "from-pink-500 to-rose-500",
        shadow: "shadow-pink-500/20",
        text: "text-pink-400",
        dot: "bg-pink-500"
      },
      purple: {
        bg: "from-purple-500 to-indigo-500",
        shadow: "shadow-purple-500/20",
        text: "text-purple-400",
        dot: "bg-purple-500"
      },
      green: {
        bg: "from-green-500 to-emerald-500",
        shadow: "shadow-green-500/20",
        text: "text-green-400",
        dot: "bg-green-500"
      },
      orange: {
        bg: "from-orange-500 to-amber-500",
        shadow: "shadow-orange-500/20",
        text: "text-orange-400",
        dot: "bg-orange-500"
      },
      cyan: {
        bg: "from-cyan-500 to-blue-500",
        shadow: "shadow-cyan-500/20",
        text: "text-cyan-400",
        dot: "bg-cyan-500"
      },
      indigo: {
        bg: "from-indigo-500 to-purple-500",
        shadow: "shadow-indigo-500/20",
        text: "text-indigo-400",
        dot: "bg-indigo-500"
      },
      red: {
        bg: "from-red-500 to-pink-500",
        shadow: "shadow-red-500/20",
        text: "text-red-400",
        dot: "bg-red-500"
      },
      yellow: {
        bg: "from-yellow-500 to-orange-500",
        shadow: "shadow-yellow-500/20",
        text: "text-yellow-400",
        dot: "bg-yellow-500"
      }
    }
    return colors[color] || colors.purple
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
          <span className="font-bold">Our Services</span>
        </div>
        <div className="w-16"></div>
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative py-24 px-6 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold tracking-wider text-xs uppercase"
            >
              <Code size={14} /> IT Solutions
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold leading-tight"
            >
              Complete IT <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Services Portfolio</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-xl text-gray-300 leading-relaxed"
            >
              From mobile apps to AI solutions, web development to 3D projects—we offer comprehensive IT services 
              to transform your business and bring your vision to life.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Services Grid */}
      <section className="py-24 px-6 bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading services...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceCategories.map((category, index) => {
                const colors = getColorClasses(category.color)
                const IconComponent = typeof category.icon === 'string' ? iconMap[category.icon] || Package : category.icon
                return (
                  <motion.div
                    key={category._id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                    className="group bg-black border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all hover:-translate-y-2"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${colors.shadow}`}>
                      <IconComponent className="text-white w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{category.title}</h3>
                    {category.description && (
                      <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                    )}
                    <ul className="space-y-2 text-sm text-gray-500">
                      {(category.services || category.features || []).map((service, serviceIndex) => (
                        <li key={serviceIndex} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 ${colors.dot} rounded-full`}></div>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-24 px-6 bg-black border-t border-white/10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Let's discuss how our comprehensive IT services can help you achieve your goals. 
            From mobile apps to AI solutions, we've got you covered.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 text-white font-bold rounded-full hover:bg-purple-400 transition-all transform hover:scale-105"
          >
            Get in Touch <ArrowRight size={20} />
          </a>
        </div>
      </motion.section>
    </div>
  )
}

