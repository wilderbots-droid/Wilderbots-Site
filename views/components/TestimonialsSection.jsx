import { useState, useEffect } from 'react'
import { Star, Quote } from 'lucide-react'
import Image from 'next/image'

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews')
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data.reviews || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      // Fallback to default testimonials
      setTestimonials([
        {
          quote: "Building my own watch felt like magic. I programmed it to unlock my smart door lock. Best weekend project ever.",
          name: "Alex R.",
          role: "Maker & Student",
          avatar: "https://i.pravatar.cc/150?img=11"
        },
        {
          quote: "I use the Neureck platform for my university courses. It's the most engaging way to learn complex tech subjects.",
          name: "Sarah K.",
          role: "Computer Science Student",
          avatar: "https://i.pravatar.cc/150?img=5"
        },
        {
          quote: "The open API allowed our research team to collect raw accelerometer data for our gait analysis study. Invaluable tool.",
          name: "Dr. David L.",
          role: "Research Scientist",
          avatar: "https://i.pravatar.cc/150?img=33"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-24 px-6 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4 scroll-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold tracking-wider text-xs uppercase">
            <Star size={14} /> Community Love
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Wilderbots <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">In The Wild.</span></h2>
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading testimonials...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, i) => (
              <div key={testimonial._id || i} className="bg-neutral-900/50 border border-white/10 rounded-3xl p-8 relative scroll-fade-in" style={{ transitionDelay: `${i * 0.15}s` }}>
                <Quote className="absolute top-8 right-8 text-white/10 w-12 h-12" />
                <div className="flex items-center gap-4 mb-6">
                  <Image 
                    src={testimonial.avatar || 'https://i.pravatar.cc/150'} 
                    alt={testimonial.name} 
                    width={48} 
                    height={48} 
                    className="w-12 h-12 rounded-full" 
                    unoptimized 
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
