import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Box, Terminal, Github, Cpu, Zap, Ruler, Smartphone, Database, Wrench, PenTool, CheckCircle, Code, Video, FileText, Heart, Mic, Smile, Settings, Bell, Store, Bot, Calendar, Home } from 'lucide-react'
import Image from 'next/image'
import Logo from './Logo'

export default function DevKitLandingPage({ onBack, onOrder }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      const response = await fetch('/api/product')
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }
      const data = await response.json()
      setProduct(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading product: {error}</p>
          <button onClick={onBack} className="text-green-400 hover:text-green-300">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500 selection:text-black overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-white/10 p-6 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-2">
          <Logo size={35} showText={false} />
          <span className="font-bold">Wilder Watch {product.edition}</span>
        </div>
        <div className="w-16"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/20 rounded-full blur-[120px] animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">{product.edition}</div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                {product.title}<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">{product.subtitle}</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                {product.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={onOrder}
                  className="px-8 py-4 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Order Now (Rs {product.price}) <ArrowRight size={20} />
                </button>
                <a 
                  href="https://github.com/wilderbots" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  View Documentation <Github size={20} />
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl overflow-hidden flex items-center justify-center">
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  width={800}
                  height={600}
                  className="object-contain"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="flex gap-4 text-xs font-mono text-green-400">
                    <span>[W1-CHIP]</span>
                    <span>[ESP32-S3]</span>
                    <span>[LIPO-350]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What's Inside the Box?</h2>
            <p className="text-xl text-gray-400">Everything you need to build and customize your watch</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-black rounded-[2rem] p-8 border border-white/10 group hover:border-green-500/50 transition-all">
              <PenTool className="text-pink-400 w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Total Customization</h3>
              <p className="text-gray-400">
                Design your own 3D-printable cases or modify the UI. It's your watch, make it look like you.
              </p>
            </div>

            <div className="bg-black rounded-[2rem] p-8 border border-white/10 group hover:border-green-500/50 transition-all">
              <Cpu className="text-green-400 w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Hackable Core</h3>
              <p className="text-gray-400">
                Powered by the W1-Dev chip. Access raw sensor data, run Python scripts directly on the wrist, and experiment with edge AI models.
              </p>
            </div>

            <div className="bg-black rounded-[2rem] p-8 border border-white/10 group hover:border-green-500/50 transition-all">
              <Github className="text-white w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Open Source</h3>
              <p className="text-gray-400">
                Join thousands of students sharing custom watch faces, health algorithms, and games. Clone the repo and start building.
              </p>
            </div>
          </div>

          {/* Build Process */}
          <div className="bg-black rounded-3xl p-12 border border-white/10">
            <h3 className="text-3xl font-bold mb-12 text-center">From Box to Wrist</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <Box className="text-yellow-400 w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold mb-3">01. Unbox & Assemble</h4>
                <p className="text-gray-400">
                  Receive your kit with all necessary components. Follow our 3D interactive guide to snap the PCB, screen, and sensors into the chassis. No soldering required.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <Code className="text-blue-400 w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold mb-3">02. Code & Customize</h4>
                <p className="text-gray-400">
                  Connect to your laptop via USB-C. Load our pre-built OS or start writing your own Python scripts to control the sensors and display.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <CheckCircle className="text-green-400 w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold mb-3">03. Wear & Research</h4>
                <p className="text-gray-400">
                  Strap it on. Collect real-time data for your research projects, show off your custom watch face, or use it as a daily driver.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">AI-Powered Features</h2>
            <p className="text-xl text-gray-400">Intelligent capabilities that make your watch truly smart</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* AI Meeting Companion */}
            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/10 group hover:border-blue-500/50 transition-all">
              <Video className="text-blue-400 w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-3">AI Meeting Companion</h3>
              <p className="text-gray-400 mb-4">
                Join Zoom and Teams meetings via companion app. Automatically takes notes and extracts key decisions for you.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Join meetings via companion app
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Automatic note-taking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Decision extraction
                </li>
              </ul>
            </div>

            {/* AI Health Diary */}
            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/10 group hover:border-pink-500/50 transition-all">
              <Heart className="text-pink-400 w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-3">AI Health Diary</h3>
              <p className="text-gray-400 mb-4">
                Use natural speech input like "Today I walked 4km and ate rice and dal". AI tracks patterns and provides insights.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Voice-based logging
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Pattern recognition
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Health insights
                </li>
              </ul>
            </div>

            {/* AI Mood Companion */}
            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/10 group hover:border-purple-500/50 transition-all">
              <Smile className="text-purple-400 w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-3">AI Mood Companion</h3>
              <p className="text-gray-400 mb-4">
                Tracks tone of voice and suggests personalized relaxation tips, motivational speaking, and music recommendations.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Voice tone analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Relaxation suggestions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Music recommendations
                </li>
              </ul>
            </div>

            {/* Customizable AI Personalities */}
            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/10 group hover:border-yellow-500/50 transition-all">
              <Settings className="text-yellow-400 w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Customizable AI Personalities</h3>
              <p className="text-gray-400 mb-4">
                Choose or create your assistant personality. Customize voice style and response style (friendly, robotic, serious, funny). Store as profiles.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Multiple personality profiles
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Voice style customization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Response style options
                </li>
              </ul>
            </div>

            {/* Smart Notifications */}
            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/10 group hover:border-cyan-500/50 transition-all">
              <Bell className="text-cyan-400 w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Smart Notifications</h3>
              <p className="text-gray-400 mb-4">
                Intelligent app pushes for weather highlights, reminders, schedule summaries, and news briefings.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Weather highlights
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Schedule summaries
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  News briefings
                </li>
              </ul>
            </div>

            {/* Plugin/Agent Store */}
            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/10 group hover:border-green-500/50 transition-all">
              <Store className="text-green-400 w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Plugin/Agent Store</h3>
              <p className="text-gray-400 mb-4">
                Developers can publish task agents, skills, and workflows. Examples include study agents, voice calendar assistants, and IoT controllers.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Publish custom agents
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Study & calendar agents
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  IoT controller agents
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Dev Kit Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-900/50 p-8 rounded-[2rem] border border-white/5">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Ruler className="text-blue-400 w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Form Factor</h4>
                  <p className="text-gray-400 text-sm">Modular PCB design. Fits standard 22mm straps.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Cpu className="text-purple-400 w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Microcontroller</h4>
                  <p className="text-gray-400 text-sm">ESP32-S3 Dual Core with AI Acceleration.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Terminal className="text-green-400 w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Programmability</h4>
                  <p className="text-gray-400 text-sm">USB-C Debugging, OTA Updates, MicroPython support.</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Smartphone className="text-yellow-400 w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Display Module</h4>
                  <p className="text-gray-400 text-sm">1.69" IPS LCD Touchscreen (replaceable).</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Database className="text-blue-400 w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Expansion</h4>
                  <p className="text-gray-400 text-sm">I2C/UART/SPI breakout pads for adding custom sensors.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Zap className="text-orange-400 w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Battery</h4>
                  <p className="text-gray-400 text-sm">350mAh LiPo (User replaceable).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-neutral-900 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Build?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of makers, students, and researchers building the future of wearable tech.
          </p>
          <button 
            onClick={onOrder}
            className="px-12 py-5 bg-green-500 text-black font-bold text-xl rounded-full hover:bg-green-400 transition-all transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
          >
            Order Your Dev Kit (Rs {product.price}) <ArrowRight size={24} />
          </button>
          <p className="text-sm text-gray-500 mt-6">
            Free shipping worldwide • 10-day processing time • 30-day money-back guarantee
          </p>
        </div>
      </section>
    </div>
  )
}

