import { useEffect } from 'react'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function App({ Component, pageProps }) {
  const isProduction = process.env.NODE_ENV === 'production'
  const router = useRouter()
  const { events, isReady, pathname, replace } = router

  useEffect(() => {
    if (!isReady) return undefined
    if (pathname.startsWith('/admin') || pathname === '/maintenance') return undefined

    const controller = new AbortController()

    const checkMaintenance = async () => {
      try {
        const response = await fetch('/api/maintenance', {
          signal: controller.signal,
          cache: 'no-store'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.maintenance?.isActive && pathname !== '/maintenance') {
            replace('/maintenance')
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error checking maintenance mode:', error)
        }
      }
    }

    checkMaintenance()

    return () => {
      controller.abort()
    }
  }, [isReady, pathname, replace])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    const observeElements = () => {
      const animatedElements = document.querySelectorAll(
        '.scroll-fade-in:not(.visible), .scroll-slide-left:not(.visible), .scroll-slide-right:not(.visible), .scroll-scale-in:not(.visible)'
      )
      animatedElements.forEach((el) => {
        observer.observe(el)
      })
    }

    const initialTimeout = setTimeout(() => {
      observeElements()
    }, 100)

    const handleRouteChangeComplete = () => {
      setTimeout(() => {
        observeElements()
      }, 150)
    }

    events.on('routeChangeComplete', handleRouteChangeComplete)

    const handleRouteChangeStart = () => {
      const allAnimatedElements = document.querySelectorAll(
        '.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale-in'
      )
      allAnimatedElements.forEach((el) => {
        el.classList.remove('visible')
      })
    }
    events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      clearTimeout(initialTimeout)
      events.off('routeChangeComplete', handleRouteChangeComplete)
      events.off('routeChangeStart', handleRouteChangeStart)
      observer.disconnect()
    }
  }, [events])

  return (
    <>
      <Component {...pageProps} />
      {isProduction && <Analytics />}
      {isProduction && <SpeedInsights />}
    </>
  )
}
