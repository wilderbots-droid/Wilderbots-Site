import { useState, useEffect } from 'react'
import Head from 'next/head'
import PublicPageShell from '../views/components/PublicPageShell'

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
      <PublicPageShell
        onBack={() => window.history.back()}
        eyebrow="Policy"
        title={title}
        description={`Last updated: ${lastUpdated}`}
      >
        <section className="rounded-[2rem] border border-white/10 bg-zinc-950/35 px-6 py-12 backdrop-blur-xl">
          <div className="prose prose-invert prose-lg mx-auto max-w-4xl">
            <div
              className="space-y-8 text-zinc-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </section>
      </PublicPageShell>
    </>
  )
}
