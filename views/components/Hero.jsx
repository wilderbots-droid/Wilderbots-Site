import { ArrowRight, Wrench } from 'lucide-react'

export default function Hero({ onOrderClick }) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
      {/* Abstract Background Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px]"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-medium tracking-wide text-gray-300">THE FUTURE IS NOW</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Wilder than <br /> Imagination.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Pioneering the next generation of wearable tech and interactive education. 
          We are Wilderbots.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 relative z-50 pointer-events-auto">
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (onOrderClick) onOrderClick()
            }} 
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer relative z-50 pointer-events-auto"
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
            className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer relative z-50 pointer-events-auto"
          >
            Visit Neureck <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* Hero Image / Graphic */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none"></div>
    </section>
  )
}

