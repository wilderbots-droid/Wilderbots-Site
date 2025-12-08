import { useState, useEffect } from 'react'
import Head from 'next/head'
import Navigation from '../views/components/Navigation'
import Footer from '../views/components/Footer'
import Logo from '../views/components/Logo'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_CONTENT = `
<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
  <p class="text-gray-300 leading-relaxed">By accessing and using the Wilderbots website, products, and services, you accept and agree to be bound by the terms and provision of this agreement.</p>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">2. Use License</h2>
  <p class="text-gray-300 leading-relaxed">Permission is granted to temporarily access the materials on Wilderbots' website for personal, non-commercial transitory viewing only.</p>
</section>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4">3. Contact Information</h2>
  <p class="text-gray-300 leading-relaxed">If you have any questions about these Terms of Service, please contact us.</p>
</section>
`

export default function TermsOfService() {
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPolicy()
  }, [])

  const fetchPolicy = async () => {
    try {
      const response = await fetch('/api/policies?type=terms')
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

  const title = policy?.title || 'Terms of Service'
  const content = policy?.content || DEFAULT_CONTENT
  const lastUpdated = policy?.lastUpdated ? new Date(policy.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <>
      <Head>
        <title>{title} - Wilderbots</title>
        <meta name="description" content="Wilderbots Terms of Service - Read our terms and conditions for using our website, products, and services." />
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
