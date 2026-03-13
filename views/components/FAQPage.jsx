import { useState, useEffect } from 'react'
import { ArrowLeft, ChevronRight, HelpCircle } from 'lucide-react'
import Logo from './Logo'

export default function FAQPage({ onBack }) {
  const [activeAccordion, setActiveAccordion] = useState(null)
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/faqs')
      if (response.ok) {
        const data = await response.json()
        setFaqs(data.faqs || [])
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      // Fallback to default FAQs
      setFaqs([
        { category: "Product", q: "Is the Wilder Watch Dev Kit pre-assembled?", a: "No, it ships as a DIY kit." },
        { category: "Product", q: "What programming languages does the Wilder Watch support?", a: "The Wilder Watch natively supports MicroPython and C++." },
        { category: "Ordering & Shipping", q: "How long does shipping take?", a: "Orders are processed immediately, but shipping commences 10 business days after order confirmation." },
        { category: "IT Services", q: "What IT services does Wilderbots offer?", a: "We offer comprehensive IT services including Application Development, Web Development, AI & Machine Learning, and more." }
      ])
    } finally {
      setLoading(false)
    }
  }

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

  const defaultFaqs = [
    // Product Questions
    { 
      category: "Product",
      q: "Is the Wilder Watch Dev Kit pre-assembled?", 
      a: "No, it ships as a DIY kit. We believe the best way to understand technology is to build it. A detailed 3D interactive guide makes assembly easy for everyone—no soldering required. The kit includes all necessary components: PCB, display, sensors, battery, and chassis." 
    },
    { 
      category: "Product",
      q: "What programming languages does the Wilder Watch support?", 
      a: "The Wilder Watch natively supports MicroPython and C++ (Arduino/ESP-IDF). It's perfect for both beginners learning embedded programming and advanced developers building custom applications. The device also supports our open-source OS with pre-built watch faces and features." 
    },
    { 
      category: "Product",
      q: "Can I use the Wilder Watch as a regular smartwatch?", 
      a: "Absolutely! Once assembled and flashed with our default OS, it functions as a fully-featured smartwatch with notifications, health tracking, timekeeping, and connectivity features. You can also customize it with your own code or choose from our community-created watch faces." 
    },
    { 
      category: "Product",
      q: "What's included in the Dev Kit?", 
      a: "The complete kit includes: ESP32-S3 microcontroller, 1.69\" IPS LCD touchscreen, 350mAh LiPo battery, modular PCB with all sensors, chassis components, USB-C cable for programming, and comprehensive assembly guide. Everything you need to build your watch is included." 
    },
    { 
      category: "Product",
      q: "Is the Wilder Watch open source?", 
      a: "Yes! Our firmware, hardware designs, and software are open source. You can find our code on GitHub, modify it, and contribute to the community. We encourage makers to share their custom watch faces, health algorithms, and projects with the community." 
    },
    
    // Ordering & Shipping
    { 
      category: "Ordering & Shipping",
      q: "How long does shipping take?", 
      a: "Orders are processed immediately, but due to high demand and quality assurance checks, shipping commences 10 business days after order confirmation. We ship to over 35 countries worldwide. International shipping typically takes 5-10 additional business days depending on your location." 
    },
    { 
      category: "Ordering & Shipping",
      q: "Do you accept Cash on Delivery (COD)?", 
      a: "No, we require full pre-payment for all Development Kit orders. This ensures we can secure your hardware allocation and maintain our quality standards. We accept all major credit and debit cards through our secure checkout process." 
    },
    { 
      category: "Ordering & Shipping",
      q: "What is the price of the Wilder Watch Dev Kit?", 
      a: "The Wilder Watch Dev Kit is priced at Rs 299.00. This includes all components, assembly guide, and access to our open-source firmware. Shipping costs may vary by location and will be calculated at checkout." 
    },
    { 
      category: "Ordering & Shipping",
      q: "Do you ship internationally?", 
      a: "Yes, we ship to over 35 countries worldwide. Shipping times vary by location but typically range from 5-10 business days after the 10-day processing period. You can check shipping availability and costs during checkout." 
    },
    
    // IT Services
    { 
      category: "IT Services",
      q: "What IT services does Wilderbots offer?", 
      a: "We offer comprehensive IT services including: Application Development (iOS & Android), Web Development, Software Development (Desktop & Cloud), AI & Machine Learning (LLM Finetuning, Custom AI Models, Chatbots), Computer Vision, UI/UX Design, Data Analysis, 3D/AR/VR Projects, Video Editing, and Digital Marketing. Visit our Services page for complete details." 
    },
    { 
      category: "IT Services",
      q: "How do I get started with your IT services?", 
      a: "Simply contact us through our Contact page or email business@wilderbots.com. Our team will schedule a consultation to understand your needs and provide a customized proposal. We work with businesses of all sizes, from startups to enterprises." 
    },
    { 
      category: "IT Services",
      q: "Do you provide AI and machine learning services?", 
      a: "Yes! We specialize in AI solutions including LLM finetuning, custom AI model development, NLP solutions, continued pre-training, agent chatbot development, multi-modal agents, and speech recognition systems. Our team has extensive experience in deploying AI solutions for various industries." 
    },
    
    // Education & Neureck
    { 
      category: "Education & Neureck",
      q: "What is Neureck?", 
      a: "Neureck is our dedicated educational platform that revolutionizes STEM learning. It features interactive AI-driven modules, hands-on projects, and a global community of learners. Neureck makes complex technology concepts accessible and engaging for students, educators, and professionals." 
    },
    { 
      category: "Education & Neureck",
      q: "Can I access Neureck without buying the Wilder Watch?", 
      a: "Absolutely! Neureck is a standalone web platform accessible from any browser at neureck.com. While owning a Wilder Watch unlocks exclusive biometric learning data and hands-on projects, the platform itself is free to explore and use." 
    },
    { 
      category: "Education & Neureck",
      q: "Is Neureck suitable for schools and universities?", 
      a: "Yes! Neureck is designed for educational institutions. We offer special programs for schools and universities, including curriculum integration, teacher training, and bulk licensing options. Contact education@wilderbots.com for institutional partnerships." 
    },
    
    // Technical Support
    { 
      category: "Technical Support",
      q: "What technical support do you provide?", 
      a: "We provide comprehensive support through multiple channels: email support (support@wilderbots.com), detailed documentation, GitHub community forums, and video tutorials. For IT services clients, we offer dedicated support packages tailored to your needs." 
    },
    { 
      category: "Technical Support",
      q: "What are the technical specifications of the Wilder Watch?", 
      a: "The Dev Kit features: ESP32-S3 Dual Core microcontroller with AI acceleration, 1.69\" IPS LCD touchscreen, 350mAh LiPo battery (user replaceable), modular PCB design fitting 22mm straps, USB-C debugging, OTA update support, and I2C/UART/SPI expansion pads for custom sensors." 
    },
    
    // Company
    { 
      category: "Company",
      q: "What type of company is Wilderbots?", 
      a: "Wilderbots operates as three integrated businesses: a Product Company (designing and manufacturing the Wilder Watch Dev Kit), a Service Company (providing comprehensive IT services), and an Ed-Tech Company (through the Neureck platform). We're uniquely positioned at the intersection of hardware, software, and education." 
    },
    { 
      category: "Company",
      q: "How can I stay updated on new products and features?", 
      a: "Subscribe to our newsletter on the homepage, follow us on social media (LinkedIn, GitHub, Twitter), or join our community on GitHub. We regularly announce new features, firmware updates, and educational content through these channels." 
    }
  ]

  // Transform API FAQs to match component structure
  const transformedFaqs = faqs.map(faq => ({
    category: faq.category,
    q: faq.question,
    a: faq.answer
  }))

  // Group FAQs by category
  const faqsByCategory = transformedFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = []
    }
    acc[faq.category].push(faq)
    return acc
  }, {})

  const categories = Object.keys(faqsByCategory)

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-white/10 p-6 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-2">
          <Logo size={35} showText={false} />
          <span className="font-bold">FAQ</span>
        </div>
        <div className="w-16"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold tracking-wider text-xs uppercase">
              <HelpCircle size={14} /> Frequently Asked Questions
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Got Questions? <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">We've Got Answers.</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Find answers to common questions about our products, services, education platform, and more. 
              Can't find what you're looking for? Contact us and we'll be happy to help.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs by Category */}
      <section className="py-24 px-6 bg-neutral-900">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading FAQs...</div>
          ) : categories.length > 0 ? (
            categories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">{category}</h2>
                <div className="space-y-4">
                  {faqsByCategory[category].map((item, index) => {
                    const globalIndex = transformedFaqs.findIndex(f => f === item)
                    return (
                      <div key={index} className="border border-white/10 rounded-2xl overflow-hidden bg-black/50">
                        <button 
                          onClick={() => toggleAccordion(globalIndex)}
                          className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors"
                        >
                          <span className="font-bold text-lg pr-4">{item.q}</span>
                          <ChevronRight className={`transition-transform duration-300 flex-shrink-0 ${activeAccordion === globalIndex ? 'rotate-90' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === globalIndex ? 'max-h-96' : 'max-h-0'}`}>
                          <div className="p-6 pt-0 text-gray-400 leading-relaxed">
                            {item.a}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">No FAQs available at the moment.</div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Can't find the answer you're looking for? Our team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-purple-500 text-white font-bold rounded-full hover:bg-purple-400 transition-all transform hover:scale-105"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}

