import { Layers, Box, Code, CheckCircle, ArrowRight } from 'lucide-react'

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 px-6 bg-neutral-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 scroll-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold tracking-wider text-xs uppercase mb-4">
            <Layers size={14} /> From Box to Wrist
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">Your Journey.</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 relative scroll-slide-left">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
              <Box className="text-yellow-400 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">01. Unbox & Assemble</h3>
            <p className="text-gray-400 leading-relaxed">
              Receive your kit with all necessary components. Follow our 3D interactive guide to snap the PCB, screen, and sensors into the chassis. No soldering required.
            </p>
          </div>
          
          <div className="p-6 relative scroll-fade-in">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
              <Code className="text-blue-400 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">02. Code & customize</h3>
            <p className="text-gray-400 leading-relaxed">
              Connect to your laptop via USB-C. Load our pre-built OS or start writing your own Python scripts to control the sensors and display.
            </p>
          </div>
          
          <div className="p-6 relative scroll-slide-right">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
              <CheckCircle className="text-green-400 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">03. Wear & Research</h3>
            <p className="text-gray-400 leading-relaxed">
              Strap it on. Collect real-time data for your research projects, show off your custom watch face, or use it as a daily driver.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
