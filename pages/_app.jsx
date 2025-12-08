import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import { AuthProvider } from '../contexts/AuthContext'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const [maintenanceChecked, setMaintenanceChecked] = useState(false)

  // Check maintenance mode on route change
  useEffect(() => {
    const checkMaintenance = async () => {
      // Skip check for admin routes and maintenance page itself
      if (router.pathname.startsWith('/admin') || router.pathname === '/maintenance') {
        setMaintenanceChecked(true)
        return
      }

      try {
        const response = await fetch('/api/maintenance')
        if (response.ok) {
          const data = await response.json()
          if (data.maintenance?.isActive) {
            // Redirect to maintenance page if not already there
            if (router.pathname !== '/maintenance') {
              router.replace('/maintenance')
            }
          }
        }
      } catch (error) {
        console.error('Error checking maintenance mode:', error)
      } finally {
        setMaintenanceChecked(true)
      }
    }

    if (router.isReady) {
      checkMaintenance()
    }
  }, [router.pathname, router.isReady])

  useEffect(() => {
    // Smooth scroll animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Function to observe elements
    const observeElements = () => {
      const animatedElements = document.querySelectorAll(
        '.scroll-fade-in:not(.visible), .scroll-slide-left:not(.visible), .scroll-slide-right:not(.visible), .scroll-scale-in:not(.visible)'
      )
      animatedElements.forEach((el) => {
        observer.observe(el)
      })
    }

    // Initial observation after DOM is ready
    const initialTimeout = setTimeout(() => {
      observeElements()
    }, 100)

    // Re-observe on route changes
    const handleRouteChangeComplete = () => {
      setTimeout(() => {
        observeElements()
      }, 150)
    }

    // Listen to route change events
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    
    // Also listen to route change start to reset animations if needed
    const handleRouteChangeStart = () => {
      // Optionally reset animations on route change
      const allAnimatedElements = document.querySelectorAll(
        '.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale-in'
      )
      allAnimatedElements.forEach((el) => {
        el.classList.remove('visible')
      })
    }
    
    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      clearTimeout(initialTimeout)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
      router.events.off('routeChangeStart', handleRouteChangeStart)
      observer.disconnect()
    }
  }, [router.events])

  // Additional effect to observe elements when component updates (for client-side navigation)
  useEffect(() => {
    let observer = null
    
    const timeoutId = setTimeout(() => {
      const animatedElements = document.querySelectorAll(
        '.scroll-fade-in:not(.visible), .scroll-slide-left:not(.visible), .scroll-slide-right:not(.visible), .scroll-scale-in:not(.visible)'
      )
      
      if (animatedElements.length > 0) {
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }

        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              observer.unobserve(entry.target)
            }
          })
        }, observerOptions)

        animatedElements.forEach((el) => {
          observer.observe(el)
        })
      }
    }, 200)

    return () => {
      clearTimeout(timeoutId)
      if (observer) {
        observer.disconnect()
      }
    }
  })

  // Show loading state while checking maintenance
  if (!maintenanceChecked && !router.pathname.startsWith('/admin') && router.pathname !== '/maintenance') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-purple-600 mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
