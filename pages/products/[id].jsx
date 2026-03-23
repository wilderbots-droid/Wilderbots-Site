import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navigation from '../../views/components/Navigation'
import Footer from '../../views/components/Footer'
import Image from 'next/image'
import { 
  Cpu, Zap, ArrowRight, Ruler, Smartphone, Terminal, 
  PenTool, Github, Box, Database, Wrench, X, Check, 
  Code, Video, Heart, Smile, Settings, Bell, Store, 
  CheckCircle, MapPin, Calendar, CreditCard, ShieldCheck, 
  BarChart3, UserCheck, SmartphoneNfc
} from 'lucide-react'

const iconMap = {
  Cpu, Zap, ArrowRight, Ruler, Smartphone, Terminal, 
  PenTool, Github, Box, Database, Wrench, X, Check, 
  Code, Video, Heart, Smile, Settings, Bell, Store, 
  CheckCircle, MapPin, Calendar, CreditCard, ShieldCheck, 
  BarChart3, UserCheck, SmartphoneNfc
}

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product?id=${id}`)
        const data = await response.json()
        if (response.ok) {
          setProduct(data)
        } else {
          console.error('Failed to fetch product')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-400 mb-8">The product you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const isDevKit = product.title.toLowerCase().includes('watch') || product.edition.toLowerCase().includes('dev')
  const isNightlife = product.title.toLowerCase().includes('bottle') || product.title.toLowerCase().includes('nightlife')

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white">
      <Head>
        <title>{product.title} - Wilderbots</title>
        <meta name="description" content={product.subtitle} />
      </Head>

      <Navigation />

      <main className="pt-24">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`relative py-20 px-6 overflow-hidden ${isNightlife ? 'bg-gradient-to-b from-indigo-950/20 to-black' : ''}`}
        >
          {isNightlife && (
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
          )}
          
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-8"
            >
              <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
                isNightlife ? 'bg-indigo-500/20 text-indigo-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {product.edition}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                {product.title}
              </h1>
              <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
                {product.subtitle}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {product.showCta !== false && (
                  <button 
                    onClick={() => {
                      if (product.ctaLink) {
                        if (product.ctaLink.startsWith('http')) {
                          window.open(product.ctaLink, '_blank')
                        } else {
                          router.push(product.ctaLink)
                        }
                      } else if (isDevKit) {
                        router.push('/?view=order')
                      } else {
                        router.push('/')
                      }
                    }}
                    className={`px-8 py-4 font-bold rounded-full transition-all transform hover:scale-105 flex items-center gap-2 ${
                      isNightlife ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {product.ctaText} <ArrowRight size={20} />
                  </button>
                )}
                
                {/* App Store Buttons for Services */}
                {(product.appStoreLink || product.playStoreLink) && (
                  <div className="flex flex-wrap gap-4">
                    {product.appStoreLink && (
                      <a 
                        href={product.appStoreLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="h-[56px] px-6 bg-black border border-white/10 rounded-2xl flex items-center justify-center hover:bg-neutral-900 transition-all hover:border-white/30"
                      >
                         <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-[32px]" />
                      </a>
                    )}
                    {product.playStoreLink && (
                      <a 
                        href={product.playStoreLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="h-[56px] px-6 bg-black border border-white/10 rounded-2xl flex items-center justify-center hover:bg-neutral-900 transition-all hover:border-white/30"
                      >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-[32px]" />
                      </a>
                    )}
                  </div>
                )}

                {product.showPrice !== false && !product.appStoreLink && !product.playStoreLink && (
                  <div className="flex items-center gap-2 px-8 py-4 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-xl font-bold">Rs {product.price}</span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className={`absolute inset-0 blur-3xl rounded-full -z-10 opacity-30 ${
                isNightlife ? 'bg-indigo-500' : 'bg-green-500'
              }`}></div>
              {product.image && (
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  width={800}
                  height={800}
                  className="w-full h-auto object-contain drop-shadow-2xl animate-float"
                  unoptimized
                />
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* Detailed Overview */}
        <section className="py-24 px-6 bg-neutral-900/30">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">Overview</h2>
            <div className="text-lg md:text-xl text-gray-300 leading-relaxed whitespace-pre-wrap">
              {product.detailedOverview || product.description}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        {product.features && product.features.length > 0 && (
          <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Core Features</h2>
                <p className="text-xl text-gray-400">Everything that makes {product.title} exceptional</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {product.features.map((feature, index) => {
                  const Icon = iconMap[feature.icon] || CheckCircle
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                      className="p-8 bg-neutral-900/50 border border-white/5 rounded-[2rem] hover:border-white/20 transition-all group"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all ${
                        isNightlife ? 'bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white' : 'bg-green-500/20 text-green-400 group-hover:bg-green-500 group-hover:text-black'
                      }`}>
                        <Icon size={24} />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                      <p className="text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Special Section for Nightlife */}
        {isNightlife && (
          <section className="py-24 px-6 relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-900/10 to-transparent -z-10"></div>
             <div className="max-w-7xl mx-auto bg-gradient-to-br from-neutral-800 to-neutral-900 p-12 md:p-20 rounded-[3rem] border border-white/10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                  <h2 className="text-4xl font-bold leading-tight">Empowering Venues with <br/>Bar ERM</h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    A powerful tool for venue owners to manage inventory, track pours in real-time, and offer personalized service to their most loyal customers. Elevate your bar's operations to the digital age.
                  </p>
                  <button className="px-8 py-3 border border-indigo-400 text-indigo-400 hover:bg-indigo-400 hover:text-white transition-all font-bold rounded-full">
                    Learn about ERM
                  </button>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
                    <BarChart3 size={200} className="text-indigo-400 relative z-10" />
                  </div>
                </div>
             </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8 bg-neutral-900/50 p-12 md:p-20 rounded-[3rem] border border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to take the next step?</h2>
            <p className="text-xl text-gray-400">
              Join the Wilderbots community and experience the future of {isNightlife ? 'nightlife' : 'tech'}.
            </p>
            <div className="flex flex-col items-center gap-6">
              {product.showCta !== false && (
                <button 
                  onClick={() => {
                    if (product.ctaLink) {
                      if (product.ctaLink.startsWith('http')) {
                        window.open(product.ctaLink, '_blank')
                      } else {
                        router.push(product.ctaLink)
                      }
                    } else if (isDevKit) {
                      router.push('/?view=order')
                    } else {
                      router.push('/')
                    }
                  }}
                  className={`px-12 py-4 text-xl font-bold rounded-full transition-all transform hover:scale-105 ${
                    isNightlife ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.4)]' : 'bg-green-500 text-black hover:bg-green-400'
                  }`}
                >
                  Pre-order {product.title.split(' ')[0]} Now
                </button>
              )}

              {(product.appStoreLink || product.playStoreLink) && (
                <div className="flex flex-wrap justify-center gap-6 mt-4">
                  {product.appStoreLink && (
                    <a href={product.appStoreLink} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform h-[64px] bg-black px-6 rounded-2xl border border-white/10 flex items-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-[36px]" />
                    </a>
                  )}
                  {product.playStoreLink && (
                    <a href={product.playStoreLink} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform h-[64px] bg-black px-6 rounded-2xl border border-white/10 flex items-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-[36px]" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
