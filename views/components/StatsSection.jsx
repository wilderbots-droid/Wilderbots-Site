import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function StatsSection() {
  const [stats, setStats] = useState([
    { value: '50k+', label: 'Kits Shipped' },
    { value: '10k+', label: 'GitHub Stars' },
    { value: '35', label: 'Countries' },
    { value: '100+', label: 'Universities' }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()
        if (data.success) {
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])


  return (
    <section className="py-20 bg-black border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat._id || index} 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
            <div className="text-sm text-gray-500 uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
