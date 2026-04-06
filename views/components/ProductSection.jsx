import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Zap, ArrowRight, Ruler, Smartphone, Terminal, PenTool, Github, Box, Database, Wrench, X, Check, Code, Video, Heart, Smile, Settings, Bell, Store, CheckCircle } from 'lucide-react'
import Image from 'next/image'

export default function ProductSection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product')
        const data = await response.json()
        if (Array.isArray(data)) {
          setProducts(data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section id="products" className="py-24 px-6 bg-black flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </section>
    )
  }

  return (
    <section id="products" className="py-32 px-6 bg-black relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 space-y-4"
        >
          <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-widest text-gray-400 uppercase">
            Our Ecosystem
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Wilder Products.
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From wearable hardware to transformative nightlife platforms. 
            Explore the Wilderbots product lineup.
          </p>
        </motion.div>

        <div className={`grid gap-8 ${
          products.length === 2 ? 'grid-cols-1 max-w-5xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
        }`}>
          {products.map((product, index) => {
            const isPrimary = product.isPrimary
            const isNightlife = product.title.toLowerCase().includes('bottle')

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-[2.5rem] p-1 transition-all duration-500 hover:scale-[1.02] ${
                  isPrimary && products.length !== 2
                    ? 'md:col-span-2 lg:col-span-2' 
                    : ''
                }`}
              >
                {/* Border Gradient Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br -z-10 opacity-20 group-hover:opacity-100 transition-opacity duration-500 ${
                  isNightlife ? 'from-indigo-600 via-purple-600 to-black' : 'from-green-500 via-blue-500 to-black'
                }`}></div>
                
                <div className="bg-neutral-900 rounded-[2.4rem] h-full overflow-hidden flex flex-col md:flex-row items-stretch">
                  <div className={`p-8 md:p-12 space-y-6 flex-1 order-2 md:order-1 flex flex-col justify-center ${isPrimary ? 'md:max-w-xl' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isNightlife ? 'bg-indigo-500/20 text-indigo-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {product.edition}
                      </span>
                      {isPrimary && (
                        <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-3xl md:text-5xl font-bold leading-tight">
                      {product.title}
                    </h3>
                    
                    <p className="text-gray-400 text-lg line-clamp-3">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center gap-6 pt-4">
                      <a 
                        href={`/products/${product._id}`}
                        className={`flex items-center gap-2 font-bold group/link transition-all ${
                          isNightlife ? 'text-indigo-400 hover:text-indigo-300' : 'text-green-400 hover:text-green-300'
                        }`}
                      >
                        {product.ctaText} 
                        <ArrowRight size={18} className="group-hover/link:translate-x-2 transition-transform" />
                      </a>
                      {product.showPrice !== false && (
                        <span className="text-gray-500 font-mono">Rs {product.price}</span>
                      )}
                    </div>
                  </div>

                  <div className={`relative flex-1 order-1 md:order-2 self-stretch overflow-hidden flex items-center justify-center bg-black/40 ${isPrimary ? 'h-[350px] md:h-full' : 'h-[300px] md:h-full'}`}>
                    <div className={`absolute inset-0 blur-3xl opacity-20 -z-10 ${isNightlife ? 'bg-indigo-500' : 'bg-green-500'}`}></div>
                    <Image 
                      src={product.image} 
                      alt={product.title} 
                      width={500}
                      height={500}
                      className="w-full h-full object-cover drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
                      unoptimized
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
