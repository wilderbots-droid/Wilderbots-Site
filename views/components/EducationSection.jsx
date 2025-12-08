import { BookOpen, Aperture, Globe, ArrowRight, Play } from 'lucide-react'
import Image from 'next/image'

export default function EducationSection() {
  return (
    <section id="education" className="py-32 px-6 relative bg-gradient-to-b from-black via-indigo-950/20 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 scroll-slide-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold tracking-wider text-xs uppercase">
              <BookOpen size={14} /> Education Sector
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold leading-tight">
              Learn like <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Never Before.</span>
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              We don't just build hardware. We build minds. 
              Explore our dedicated educational platform where technology meets pedagogy.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-gray-400">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-white">
                  <Aperture size={24} />
                </div>
                <span>Interactive AI-driven modules</span>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-white">
                  <Globe size={24} />
                </div>
                <span>Global community of learners</span>
              </div>
            </div>
            <div className="pt-8">
              <a 
                href="https://neureck.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-700 hover:scale-105"
              >
                Visit Neureck.com
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute -inset-3 rounded-full bg-blue-500 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
              </a>
              <p className="mt-4 text-sm text-gray-500">Leaves Wilderbots to open our partner platform.</p>
            </div>
          </div>

          {/* Neureck Card Visual */}
          <div className="relative group perspective-1000 scroll-slide-right">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] transform rotate-3 scale-105 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-neutral-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl transform transition-transform duration-500 group-hover:-rotate-1 group-hover:scale-[1.02]">
              {/* Browser Header */}
              <div className="h-12 bg-neutral-800 border-b border-white/5 flex items-center px-6 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 bg-neutral-900 rounded-md px-3 py-1 text-xs text-gray-500 flex-1 text-center font-mono">neureck.com</div>
              </div>
              
              {/* Browser Content */}
              <div className="relative h-[400px]">
                <Image 
                  src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1974&auto=format&fit=crop" 
                  alt="Neureck Platform" 
                  fill
                  className="object-cover opacity-80"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                    <Play fill="white" className="ml-1 text-white" size={32} />
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-400"></div>
                    <div>
                      <p className="font-bold text-sm">Now Trending</p>
                      <p className="text-xs text-gray-400">Introduction to Neural Networks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

