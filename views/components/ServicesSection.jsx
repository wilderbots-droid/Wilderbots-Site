import { useState, useEffect } from 'react'
import { Code, Smartphone, Globe, Bot, ArrowRight, Package, Monitor, Eye, Palette, BarChart3, Box, Video, Megaphone } from 'lucide-react'

const iconMap = {
  Smartphone: Smartphone,
  Globe: Globe,
  Bot: Bot,
  Monitor: Monitor,
  Eye: Eye,
  Palette: Palette,
  BarChart3: BarChart3,
  Box: Box,
  Video: Video,
  Megaphone: Megaphone,
  Package: Package
}

export default function ServicesSection() {
  const [mainServices, setMainServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setMainServices(data.services || [])
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      // Fallback to default services
      setMainServices([
        {
          icon: Smartphone,
          title: "Application Development",
          description: "Native and cross-platform mobile experiences that feel fluid, intuitive, and engaging.",
          color: "blue",
          features: ["iOS & Android", "React Native / Flutter", "High-Performance UI"]
        },
        {
          icon: Globe,
          title: "Web Development",
          description: "Futuristic, responsive, and scalable web platforms.",
          color: "pink",
          features: ["MERN Stack", "Next.js & 3D WebGL", "Scalable Cloud Arch"]
        },
        {
          icon: Bot,
          title: "AI Solutions",
          description: "Integrating intelligence into your workflow.",
          color: "purple",
          features: ["Generative AI Models", "Chatbots & Agents", "Data Analytics"]
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getColorForService = (title) => {
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
    return colorMap[title] || 'purple'
  }

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || Package
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "from-blue-500 to-cyan-500",
        shadow: "shadow-blue-500/20",
        dot: "bg-blue-500",
        border: "hover:border-blue-500/50"
      },
      pink: {
        bg: "from-pink-500 to-rose-500",
        shadow: "shadow-pink-500/20",
        dot: "bg-pink-500",
        border: "hover:border-pink-500/50"
      },
      purple: {
        bg: "from-purple-500 to-indigo-500",
        shadow: "shadow-purple-500/20",
        dot: "bg-purple-500",
        border: "hover:border-purple-500/50"
      }
    }
    return colors[color] || colors.purple
  }

  return (
    <section id="services" className="py-24 px-6 bg-neutral-900 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4 scroll-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold tracking-wider text-xs uppercase">
            <Code size={14} /> IT Solutions
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Alchemy.</span></h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Transforming ideas into digital reality through cutting-edge development, AI integration, and creative solutions.</p>
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading services...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {mainServices.slice(0, 3).map((service, index) => {
              const color = getColorForService(service.title)
              const colors = getColorClasses(color)
              const IconComponent = getIconComponent(service.icon)
              return (
                <div key={service._id || index} className={`group bg-black border border-white/10 rounded-3xl p-8 ${colors.border} transition-all hover:-translate-y-2`}>
                  <div className={`w-14 h-14 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${colors.shadow}`}>
                    <IconComponent className="text-white w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    {(service.features || []).map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 ${colors.dot} rounded-full`}></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <a
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 text-white font-bold rounded-full hover:bg-purple-400 transition-all transform hover:scale-105"
          >
            View All Services <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  )
}
