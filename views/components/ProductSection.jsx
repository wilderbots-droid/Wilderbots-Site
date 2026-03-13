import { useEffect, useState } from 'react'
import { Cpu, Zap, ArrowRight, Ruler, Smartphone, Terminal, PenTool, Github, Box, Database, Wrench, X, Check, Code, Video, Heart, Smile, Settings, Bell, Store, CheckCircle } from 'lucide-react'
import Image from 'next/image'

export default function ProductSection({ onOrderClick }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [showBoxContents, setShowBoxContents] = useState(false)
  const [product, setProduct] = useState({})

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch('/api/product')
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product details:', error)
      }
    }
    fetchProductDetails()
  }, [])

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) / 20
    const y = (e.clientY - top - height / 2) / 20
    setTilt({ x: -y, y: x })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <section id="products" className="py-24 px-6 bg-black relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4 scroll-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">{product.title || 'Not just a Watch.<br/>It\'s a Workshop.'}</h2>
          <p className="text-xl text-gray-400">{product.subtitle || 'The Wilder Watch Development Kit. You don\'t just buy it. You build it.'}</p>
        </div>

        {/* Main Product Feature with INTERACTIVE IMAGE */}
        <div className="bg-neutral-900 rounded-[2.5rem] p-8 md:p-0 overflow-hidden mb-8 grid md:grid-cols-2 items-center scroll-fade-in">
          <div className="p-8 md:p-20 space-y-8 order-2 md:order-1">
            <div className="inline-block px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">{product.edition || 'Development Kit Edition'}</div>
            <h3 className="text-4xl md:text-5xl font-bold leading-tight">{product.engineeredBy || 'Engineered by <br/>You.'}</h3>
            <p className="text-gray-400 text-lg">
              {product.description || 'The Wilder Watch arrives as a modular kit. Follow our interactive guides to assemble the PCB, display, and battery. Then, flash your own code or use our open-source OS to customize every watch face, gesture, and AI feature.'}
            </p>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={onOrderClick}
                className="px-6 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition-all flex items-center gap-2"
                aria-label="Pre-order Wilder Watch Dev Kit"
              >
                Pre-order Kit (Rs {product.price || '299'}) <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => setShowBoxContents(true)}
                className="text-blue-400 font-semibold hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                aria-label="View what's inside the box"
              >
                What's inside the box? <Box size={16} />
              </button>
            </div>
          </div>
          <div 
            className="h-[500px] md:h-[700px] w-full relative order-1 md:order-2 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center overflow-hidden perspective-1000 cursor-move"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Interactive 3D Image */}
            <div 
              className="relative z-10 transition-transform duration-100 ease-out w-full flex justify-center"
              style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.05)` }}
            >
              <Image 
                src={product.image || '/kit.png'} 
                alt="Wilder Watch Development Kit" 
                width={700}
                height={800}
                className="w-4/5 md:w-3/4 lg:w-2/3 object-contain drop-shadow-2xl"
                unoptimized
              />
              
              {/* Floating UI Elements that move with the watch for depth */}
              <div className="absolute -right-4 top-10 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-xl animate-pulse" style={{ transform: 'translateZ(50px)' }}>
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-green-400" />
                  <span className="text-xs font-bold font-mono">waiting for input...</span>
                </div>
              </div>
              
              <div className="absolute -left-4 bottom-20 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-xl" style={{ transform: 'translateZ(30px)' }}>
                <div className="flex items-center gap-2">
                  <Wrench size={16} className="text-yellow-400" />
                  <span className="text-xs font-bold">Assembly Required</span>
                </div>
              </div>
            </div>
            
            {/* Radial Gradient Background Effect */}
            <div className="absolute inset-0 bg-radial-gradient from-green-500/10 to-transparent opacity-50 pointer-events-none"></div>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 rounded-[2rem] p-8 min-h-[300px] flex flex-col justify-between group hover:bg-neutral-800 transition-colors scroll-slide-left">
            <PenTool className="text-pink-400 w-10 h-10 mb-4" />
            <div>
              <h4 className="text-2xl font-bold mb-2">Total Customization</h4>
              <p className="text-gray-400">Design your own 3D-printable cases or modify the UI. It's your watch, make it look like you.</p>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-[2rem] p-8 min-h-[300px] flex flex-col justify-between group hover:bg-neutral-800 transition-colors md:col-span-2 relative overflow-hidden scroll-fade-in">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/10 rounded-full blur-3xl group-hover:bg-green-600/20 transition-all"></div>
            <div className="relative z-10">
              <Cpu className="text-green-400 w-10 h-10 mb-4" />
              <h4 className="text-2xl font-bold mb-2">Hackable Core</h4>
              <p className="text-gray-400 max-w-md">Powered by the W1-Dev chip. Access raw sensor data, run Python scripts directly on the wrist, and experiment with edge AI models.</p>
            </div>
            <div className="mt-8 flex gap-4">
              <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                <span className="block text-xs text-gray-500">Language</span>
                <span className="text-lg font-bold">Python / C++</span>
              </div>
              <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                <span className="block text-xs text-gray-500">OS</span>
                <span className="text-lg font-bold">OpenRTOS</span>
              </div>
            </div>
          </div>
          
          <div className="bg-neutral-900 rounded-[2rem] p-8 min-h-[300px] flex flex-col justify-between group hover:bg-neutral-800 transition-colors md:col-span-3 lg:col-span-3 relative overflow-hidden scroll-slide-right">
            <Image 
              src="/kit.png" 
              alt="Wilder Watch Development Kit" 
              fill
              className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
              unoptimized
            />
            <div className="relative z-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-8 h-full">
              <div className="max-w-xl">
                <Github className="text-white w-10 h-10 mb-4" />
                <h4 className="text-3xl font-bold mb-2">Open Source Community.</h4>
                <p className="text-gray-300 text-lg">
                  Join thousands of students sharing custom watch faces, health algorithms, and games. Clone the repo and start building.
                </p>
              </div>
              <a 
                href="https://github.com/wilderbots" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors inline-block"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>

        {/* AI Features Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">AI-Powered Features</h3>
            <p className="text-xl text-gray-400">Intelligent capabilities that make your watch truly smart</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* AI Meeting Companion */}
            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/10 group hover:border-blue-500/50 transition-all scroll-fade-in">
              <Video className="text-blue-400 w-10 h-10 mb-4" />
              <h4 className="text-2xl font-bold mb-3">AI Meeting Companion</h4>
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
            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/10 group hover:border-pink-500/50 transition-all scroll-fade-in">
              <Heart className="text-pink-400 w-10 h-10 mb-4" />
              <h4 className="text-2xl font-bold mb-3">AI Health Diary</h4>
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
            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/10 group hover:border-purple-500/50 transition-all scroll-fade-in">
              <Smile className="text-purple-400 w-10 h-10 mb-4" />
              <h4 className="text-2xl font-bold mb-3">AI Mood Companion</h4>
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
            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/10 group hover:border-yellow-500/50 transition-all scroll-fade-in">
              <Settings className="text-yellow-400 w-10 h-10 mb-4" />
              <h4 className="text-2xl font-bold mb-3">Customizable AI Personalities</h4>
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
            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/10 group hover:border-cyan-500/50 transition-all scroll-fade-in">
              <Bell className="text-cyan-400 w-10 h-10 mb-4" />
              <h4 className="text-2xl font-bold mb-3">Smart Notifications</h4>
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
            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/10 group hover:border-green-500/50 transition-all scroll-fade-in">
              <Store className="text-green-400 w-10 h-10 mb-4" />
              <h4 className="text-2xl font-bold mb-3">Plugin/Agent Store</h4>
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

        {/* Technical Specifications Section */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold mb-12 text-center">Dev Kit Specs.</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-900/50 p-8 rounded-[2rem] border border-white/5">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Ruler className="text-blue-400 w-6 h-6" />
                <div>
                  <h4 className="font-bold">Form Factor</h4>
                  <p className="text-gray-400 text-sm">Modular PCB design. Fits standard 22mm straps.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Cpu className="text-purple-400 w-6 h-6" />
                <div>
                  <h4 className="font-bold">Microcontroller</h4>
                  <p className="text-gray-400 text-sm">ESP32-S3 Dual Core with AI Acceleration.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Terminal className="text-green-400 w-6 h-6" />
                <div>
                  <h4 className="font-bold">Programmability</h4>
                  <p className="text-gray-400 text-sm">USB-C Debugging, OTA Updates, MicroPython support.</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Smartphone className="text-yellow-400 w-6 h-6" />
                <div>
                  <h4 className="font-bold">Display Module</h4>
                  <p className="text-gray-400 text-sm">1.69" IPS LCD Touchscreen (replaceable).</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Database className="text-blue-400 w-6 h-6" />
                <div>
                  <h4 className="font-bold">Expansion</h4>
                  <p className="text-gray-400 text-sm">I2C/UART/SPI breakout pads for adding custom sensors.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Zap className="text-orange-400 w-6 h-6" />
                <div>
                  <h4 className="font-bold">Battery</h4>
                  <p className="text-gray-400 text-sm">350mAh LiPo (User replaceable).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What's Inside the Box Modal */}
      {showBoxContents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowBoxContents(false)}>
          <div className="bg-black border border-white/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-black border-b border-white/10 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Box className="text-blue-400" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">What's Inside the Box?</h2>
                  <p className="text-sm text-gray-400">Wilder Watch Dev Kit - Complete Edition</p>
                </div>
              </div>
              <button
                onClick={() => setShowBoxContents(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Hardware Components */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Cpu className="text-green-400" size={20} />
                    Hardware Components
                  </h3>
                  <div className="space-y-3">
                    {[
                      { item: 'Wilder Watch PCB (W1-Dev Chip)', icon: Cpu },
                      { item: '1.69" IPS LCD Touchscreen Display', icon: Smartphone },
                      { item: '350mAh LiPo Battery', icon: Zap },
                      { item: 'Watch Chassis & Housing', icon: Box },
                      { item: '22mm Watch Strap (Black)', icon: Box },
                      { item: 'USB-C Charging Cable', icon: Zap },
                      { item: 'Assembly Tools Kit', icon: Wrench },
                      { item: 'Quick Start Guide', icon: Terminal }
                    ].map((component, index) => {
                      const Icon = component.icon
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl border border-white/10">
                          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="text-green-400" size={16} />
                          </div>
                          <span className="text-sm">{component.item}</span>
                          <Check className="text-green-400 ml-auto flex-shrink-0" size={16} />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Software & Documentation */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Terminal className="text-blue-400" size={20} />
                    Software & Documentation
                  </h3>
                  <div className="space-y-3">
                    {[
                      { item: 'OpenRTOS Pre-installed', icon: Terminal },
                      { item: 'MicroPython SDK', icon: Code },
                      { item: 'Arduino/ESP-IDF Support', icon: Code },
                      { item: '3D Interactive Assembly Guide', icon: PenTool },
                      { item: 'API Documentation', icon: Database },
                      { item: 'Sample Watch Faces', icon: Smartphone },
                      { item: 'GitHub Repository Access', icon: Github },
                      { item: 'Community Forum Access', icon: Github }
                    ].map((item, index) => {
                      const Icon = item.icon
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl border border-white/10">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="text-blue-400" size={16} />
                          </div>
                          <span className="text-sm">{item.item}</span>
                          <Check className="text-green-400 ml-auto flex-shrink-0" size={16} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-6 mb-6">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Box className="text-green-400" size={20} />
                  Everything You Need
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  The Wilder Watch Dev Kit includes all hardware components, software tools, and documentation needed to build, program, and customize your watch. No additional purchases required—just follow the interactive guide and start coding!
                </p>
              </div>

              {/* CTA */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowBoxContents(false)
                    onOrderClick()
                  }}
                  className="flex-1 px-6 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Pre-order Now <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => setShowBoxContents(false)}
                  className="px-6 py-3 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
