import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, Box, Code, CheckCircle, Wrench } from 'lucide-react'

export default function ProcessSection() {
  const [steps, setSteps] = useState([
    { title: 'Consult & Strategize', description: 'Deep dive into your vision to define a winning product strategy and technical roadmap.', icon: 'Layers' },
    { title: 'Design & Engineer', description: 'Full-stack development and precision engineering to bring your digital products to life.', icon: 'Wrench' },
    { title: 'Deploy & Support', description: 'Seamless deployment with ongoing maintenance and updates to ensure lasting impact.', icon: 'CheckCircle' }
  ])
  const [metadata, setMetadata] = useState({ title: 'Your Journey.', badgeText: 'Our Process' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const response = await fetch('/api/process-steps')
        const data = await response.json()
        if (data.success) {
          setSteps(data.steps)
          setMetadata(data.metadata)
        }
      } catch (error) {
        console.error('Error fetching process steps:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProcess()
  }, [])

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'Box': return <Box className="text-yellow-400 w-8 h-8" />
      case 'Code': return <Code className="text-blue-400 w-8 h-8" />
      case 'CheckCircle': return <CheckCircle className="text-green-400 w-8 h-8" />
      case 'Wrench': return <Wrench className="text-purple-400 w-8 h-8" />
      case 'Layers': return <Layers className="text-cyan-400 w-8 h-8" />
      default: return <CheckCircle className="text-green-400 w-8 h-8" />
    }
  }


  return (
    <section id="process" className="py-24 px-6 bg-neutral-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold tracking-wider text-xs uppercase mb-4">
            <Layers size={14} /> {metadata.badgeText}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">{metadata.title}</h2>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={step._id || index} 
              initial={{ 
                opacity: 0, 
                x: index === 0 ? -30 : index === 2 ? 30 : 0,
                y: index === 1 ? 30 : 0 
              }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="p-6 relative"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                {getIcon(step.icon)}
              </div>
              <h3 className="text-2xl font-bold mb-4">0{index + 1}. {step.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
