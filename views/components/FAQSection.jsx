import { useState, useEffect } from 'react'
import { ChevronRight, ArrowRight } from 'lucide-react'

export default function FAQSection() {
  const [activeAccordion, setActiveAccordion] = useState(null)
  const [mainFaqs, setMainFaqs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/faqs')
      if (response.ok) {
        const data = await response.json()
        // Get first 4 FAQs ordered by order field
        const faqs = (data.faqs || []).slice(0, 4).map(faq => ({
          q: faq.question,
          a: faq.answer
        }))
        setMainFaqs(faqs)
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      // Fallback to default FAQs
      setMainFaqs([
        { 
          q: "Is the Wilder Watch Dev Kit pre-assembled?", 
          a: "No, it ships as a DIY kit. We believe the best way to understand technology is to build it. A detailed 3D interactive guide makes assembly easy for everyone—no soldering required. The kit includes all necessary components: PCB, display, sensors, battery, and chassis." 
        },
        { 
          q: "What programming languages does the Wilder Watch support?", 
          a: "The Wilder Watch natively supports MicroPython and C++ (Arduino/ESP-IDF). It's perfect for both beginners learning embedded programming and advanced developers building custom applications. The device also supports our open-source OS with pre-built watch faces and features." 
        },
        { 
          q: "How long does shipping take?", 
          a: "Orders are processed immediately, but due to high demand and quality assurance checks, shipping commences 10 business days after order confirmation. We ship to over 35 countries worldwide. International shipping typically takes 5-10 additional business days depending on your location." 
        },
        { 
          q: "What IT services does Wilderbots offer?", 
          a: "We offer comprehensive IT services including: Application Development (iOS & Android), Web Development, Software Development (Desktop & Cloud), AI & Machine Learning (LLM Finetuning, Custom AI Models, Chatbots), Computer Vision, UI/UX Design, Data Analysis, 3D/AR/VR Projects, Video Editing, and Digital Marketing. Visit our Services page for complete details." 
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

  return (
    <section id="faq" className="py-24 px-6 bg-black border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading FAQs...</div>
        ) : (
          <div className="space-y-4">
            {mainFaqs.map((item, index) => (
            <div key={index} className="border border-white/10 rounded-2xl overflow-hidden bg-neutral-900/30">
              <button 
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors"
                aria-expanded={activeAccordion === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-bold text-lg pr-4">{item.q}</span>
                <ChevronRight className={`transition-transform duration-300 flex-shrink-0 ${activeAccordion === index ? 'rotate-90' : ''}`} />
              </button>
              <div 
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ${activeAccordion === index ? 'max-h-96' : 'max-h-0'}`}
                role="region"
                aria-hidden={activeAccordion !== index}
              >
                <div className="p-6 pt-0 text-gray-400 leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
        
        {/* View All Button */}
        <div className="mt-12 text-center">
          <a
            href="/faq"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 text-white font-bold rounded-full hover:bg-purple-400 transition-all transform hover:scale-105"
          >
            View All FAQs <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  )
}
