import { useState, useEffect } from 'react'
import Head from 'next/head'
import Navigation from '../views/components/Navigation'
import Footer from '../views/components/Footer'
import Logo from '../views/components/Logo'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_CONTENT = `
<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">1. Delivery Policy</h2>
  <p class="text-gray-300 leading-relaxed">We offer various shipping options to accommodate your needs. Available shipping methods and estimated delivery times will be displayed during checkout.</p>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">2. Return Policy</h2>
  <p class="text-gray-300 leading-relaxed">We want you to be completely satisfied with your purchase. You may return most items within 30 days of delivery for a full refund or exchange.</p>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">3. Contact Information</h2>
  <p class="text-gray-300 leading-relaxed">For questions about returns, delivery, or any other concerns, please contact us.</p>
</section>
`

export default function ReturnsAndDelivery() {
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPolicy()
  }, [])

  const fetchPolicy = async () => {
    try {
      const response = await fetch('/api/policies?type=returns')
      if (response.ok) {
        const data = await response.json()
        setPolicy(data.policy)
      }
    } catch (error) {
      console.error('Error fetching policy:', error)
    } finally {
      setLoading(false)
    }
  }

  const title = policy?.title || 'Returns & Delivery Policy'
  const content = policy?.content || DEFAULT_CONTENT
  const lastUpdated = policy?.lastUpdated ? new Date(policy.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <>
      <Head>
        <title>{title} - Wilderbots</title>
        <meta name="description" content="Wilderbots Returns & Delivery Policy - Learn about our return policy, shipping, and delivery information." />
        <link rel="icon" href="/logo-alone.png" type="image/png" />
      </Head>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
        <Navigation />
        
        {/* Header */}
        <div className="border-b border-white/10 p-6">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} /> Back
            </Link>
            <div className="flex items-center gap-2 ml-auto">
              <Logo size={35} showText={false} />
              <span className="font-bold">{title}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-gray-400 mb-8">Last updated: {lastUpdated}</p>

            <div 
              className="space-y-8 text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
