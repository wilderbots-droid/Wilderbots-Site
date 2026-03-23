import { motion } from 'framer-motion'
import { ArrowRight, Wrench } from 'lucide-react'
import Spline from '@splinetool/react-spline'

export default function Hero({ onOrderClick }) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden bg-black">
      {/* Spline Background - Scaled to hide watermark */}
      <div className="absolute inset-0 z-0 scale-[1.08] transform-gpu">
        <Spline
          scene="https://prod.spline.design/zmGndMoAS5LlVBnl/scene.splinecode"
        />
      </div>

      {/* Abstract Background Gradient (Reduced opacity to blend with Spline) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-4xl mx-auto space-y-6 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4 pointer-events-auto"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-medium tracking-wide text-gray-300">THE FUTURE IS NOW</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 drop-shadow-2xl pb-4 px-2"
        >
          Wilder than <br /> Imagination.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
        >
          Pioneering the next generation of wearable tech and interactive education.
          We are Wilderbots.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-8 relative z-50 pointer-events-auto"
        >
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (onOrderClick) onOrderClick()
            }}
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer relative z-50 pointer-events-auto shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            type="button"
          >
            Pre-order Kit <Wrench size={18} />
          </button>
          <a
            href="https://neureck.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="px-8 py-4 bg-black/40 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer relative z-50 pointer-events-auto"
          >
            Visit Neureck <ArrowRight size={18} />
          </a>
        </motion.div>
      </motion.div>

      {/* Hero Image / Graphic Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none"></div>
    </section>
  )
}

