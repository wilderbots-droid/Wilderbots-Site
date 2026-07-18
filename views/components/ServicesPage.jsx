import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Code, Smartphone, Globe, Bot, Monitor, Eye, BarChart3, Box, Video, Palette, Megaphone, ArrowRight, Package } from 'lucide-react'
import PublicPageShell from './PublicPageShell'

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

const prioritizeServices = (services) => {
  const rankService = (service) => {
    const title = (service?.title || '').toLowerCase()
    if (title.includes('application') || title.includes('app')) return 0
    if (title.includes('web')) return 1
    return 2
  }

  return [...services].sort((a, b) => rankService(a) - rankService(b))
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
        const services = prioritizeServices((data.services || []).map(service => ({
          ...service,
          icon: iconMap[service.icon] || Package,
          color: colorMap[service.title] || 'purple',
          services: service.features || []
        })))
        setServiceCategories(services)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      // Fallback to default services if API fails
      setServiceCategories(prioritizeServices([
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
      ]))
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
    <PublicPageShell
      onBack={onBack}
      eyebrow="Live Service Stack"
      title={
        <>
          Services shaped for
          <span className="block bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text italic text-transparent">
            modern product delivery
          </span>
        </>
      }
      description="Application and web work stay at the front, with the rest of your live database-backed services following in the same order used on the homepage."
    >
      <section className="rounded-[2rem] border border-white/10 bg-zinc-950/35 p-6 backdrop-blur-xl md:p-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="py-12 text-center text-zinc-400">Loading services...</div>
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
                    className="group rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,38,0.88)_0%,rgba(8,11,18,0.96)_100%)] p-8 transition-all hover:-translate-y-2 hover:border-white/20"
                  >
                    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${colors.bg} shadow-lg ${colors.shadow}`}>
                      <IconComponent className="text-white w-7 h-7" />
                    </div>
                    <h3 className="mb-4 font-serif-custom text-2xl font-normal text-white">{category.title}</h3>
                    {category.description && (
                      <p className="mb-4 text-sm leading-relaxed text-zinc-400">{category.description}</p>
                    )}
                    <ul className="space-y-2 text-sm text-zinc-500">
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

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-8 rounded-[2rem] border border-white/10 bg-black/35 px-6 py-16 text-center backdrop-blur-xl"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-serif-custom text-4xl font-normal text-white md:text-5xl">Ready to build?</h2>
          <p className="mb-10 text-lg font-light leading-relaxed text-zinc-400">
            Let&apos;s map the right delivery path for your app, web platform, or automation system and shape the next release around real goals.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2f6df6] to-[#2452d9] px-8 py-4 font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-transform hover:scale-[1.01]"
          >
            Get in Touch <ArrowRight size={20} />
          </Link>
        </div>
      </motion.section>
    </PublicPageShell>
  )
}
