import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, HelpCircle } from 'lucide-react'
import PublicPageShell from './PublicPageShell'

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
        { category: "Services", q: "What kind of work does Wilderbots do?", a: "We design AI systems, software products, automation workflows, and education experiences." },
        { category: "Services", q: "Can Wilderbots work with our existing tools?", a: "Yes, we usually build around your current stack and operations." },
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
    {
      category: "Services",
      q: "What kind of work does Wilderbots do?",
      a: "We design AI systems, software products, internal tools, workflow automations, and education experiences."
    },
    {
      category: "Services",
      q: "Can Wilderbots work with our existing tools?",
      a: "Yes. We usually integrate with your current products, processes, data sources, and APIs rather than replacing everything at once."
    },
    {
      category: "Services",
      q: "Do you work with startups and larger teams?",
      a: "Yes. We support founders, schools, product teams, and growing businesses that need hands-on technical delivery."
    },
    
    // Ordering & Shipping
    { 
      category: "Ordering & Shipping",
      q: "How long does shipping take?", 
      a: "Orders are processed immediately, but due to high demand and quality assurance checks, shipping commences 10 business days after order confirmation. We ship to over 35 countries worldwide. International shipping typically takes 5-10 additional business days depending on your location." 
    },
    { 
      category: "Ordering & Shipping",
      q: "How does billing work?", 
      a: "Billing depends on the scope. Some engagements are fixed-fee, while longer-term builds are milestone-based or monthly retainers." 
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
      q: "Can I access Neureck independently?", 
      a: "Absolutely. Neureck is a standalone learning platform that can be used on its own for training, curriculum, and interactive exploration." 
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
      q: "What kind of technical support do you provide?", 
      a: "We provide build support, launch support, documentation help, and ongoing iteration based on the engagement and support plan." 
    },
    
    // Company
    { 
      category: "Company",
      q: "What type of company is Wilderbots?", 
      a: "Wilderbots operates across software services, AI systems, and education experiences. We help teams ship useful products and learning platforms with strong technical execution." 
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
    <PublicPageShell
      onBack={onBack}
      eyebrow="FAQ"
      title={
        <>
          Clear answers for
          <span className="block bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text italic text-transparent">
            teams considering Wilderbots
          </span>
        </>
      }
      description="Find the key details around services, delivery, education, and support in the same new interface system used on the homepage."
    >
      <section className="rounded-[2rem] border border-white/10 bg-zinc-950/35 p-6 backdrop-blur-xl md:p-8">
        <div className="mx-auto max-w-4xl">
          {loading ? (
            <div className="py-12 text-center text-zinc-400">Loading FAQs...</div>
          ) : categories.length > 0 ? (
            categories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.05 }}
                className="mb-16"
              >
                <h2 className="mb-8 text-center font-serif-custom text-3xl font-normal text-white">{category}</h2>
                <div className="space-y-4">
                  {faqsByCategory[category].map((item, index) => {
                    const globalIndex = transformedFaqs.findIndex(f => f === item)
                    return (
                      <div key={index} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,38,0.88)_0%,rgba(8,11,18,0.96)_100%)]">
                        <button 
                          onClick={() => toggleAccordion(globalIndex)}
                          className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/5"
                        >
                          <span className="pr-4 text-lg font-medium text-white">{item.q}</span>
                          <ChevronRight className={`transition-transform duration-300 flex-shrink-0 ${activeAccordion === globalIndex ? 'rotate-90' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === globalIndex ? 'max-h-96' : 'max-h-0'}`}>
                          <div className="p-6 pt-0 leading-relaxed text-zinc-400">
                            {item.a}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-12 text-center text-zinc-400">No FAQs available at the moment.</div>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-black/35 px-6 py-16 text-center backdrop-blur-xl">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-serif-custom text-4xl font-normal text-white md:text-5xl">Still need help?</h2>
          <p className="mb-10 text-lg font-light leading-relaxed text-zinc-400">
            If the answer is not here, we can walk through your workflow, product goals, or project scope directly.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-[#2f6df6] to-[#2452d9] px-8 py-4 font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-transform hover:scale-[1.01]"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </PublicPageShell>
  )
}
