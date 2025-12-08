import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navigation from '../views/components/Navigation'
import Hero from '../views/components/Hero'
import Marquee from '../views/components/Marquee'
import ProductSection from '../views/components/ProductSection'
import ProcessSection from '../views/components/ProcessSection'
import StatsSection from '../views/components/StatsSection'
import EducationSection from '../views/components/EducationSection'
import ServicesSection from '../views/components/ServicesSection'
import FAQSection from '../views/components/FAQSection'
import TestimonialsSection from '../views/components/TestimonialsSection'
import NewsletterSection from '../views/components/NewsletterSection'
import Footer from '../views/components/Footer'
import DevKitLandingPage from '../views/components/DevKitLandingPage'
import OrderPage from '../views/components/OrderPage'

export default function Home() {
  const router = useRouter()
  
  // Derive view directly from router query, default to 'landing'
  // Use router.asPath to check actual URL path for more reliability
  const getView = () => {
    if (!router.isReady) return 'landing'
    
    // Check router.query first (most reliable)
    const queryView = router.query.view
    
    // Fallback: check asPath if query is not available yet
    if (!queryView && router.asPath.includes('view=')) {
      const match = router.asPath.match(/[?&]view=([^&]+)/)
      if (match) {
        const viewParam = match[1]
        if (viewParam === 'devkit') return 'devkit'
        if (viewParam === 'order') return 'order'
      }
    }
    
    if (queryView === 'devkit') return 'devkit'
    if (queryView === 'order') return 'order'
    return 'landing'
  }
  
  const view = getView()

  // If in Order View, render Order Page
  if (view === 'order') {
    return (
      <>
        <Head>
          <title>Order - Wilderbots</title>
        </Head>
        <OrderPage onBack={() => {
          router.push('/?view=devkit', undefined, { shallow: true })
        }} />
      </>
    )
  }

  // If in DevKit View, render DevKit Landing Page
  if (view === 'devkit') {
    return (
      <>
        <Head>
          <title>Wilder Watch Dev Kit - Wilderbots</title>
        </Head>
        <DevKitLandingPage onBack={() => {
          router.replace('/', undefined, { shallow: true })
        }} onOrder={() => {
          router.push('/?view=order', undefined, { shallow: true })
        }} />
      </>
    )
  }

  // Otherwise render Landing Page
  // Use key to force re-render when route changes
  return (
    <>
      <Head>
        <title>Wilderbots - Wilder than Imagination</title>
        <meta name="description" content="Pioneering the next generation of wearable tech and interactive education. Product. Service. Education." />
        <link rel="icon" href="/logo-alone.png" type="image/png" />
      </Head>
      <div 
        key={`home-${router.asPath}`}
        className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden"
      >
        <Navigation />
      <Hero onOrderClick={() => router.push('/?view=devkit', undefined, { shallow: true })} />
      <Marquee />
      <ProductSection onOrderClick={() => router.push('/?view=devkit', undefined, { shallow: true })} />
      <ProcessSection />
      <StatsSection />
      <EducationSection />
      <ServicesSection />
      <FAQSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
      </div>
    </>
  )
}
