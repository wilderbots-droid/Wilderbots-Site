import { useEffect, useMemo, useRef, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  ArrowRight,
  ChevronRight,
  Cpu,
  Database,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  Quote,
  Server,
  Sparkles,
  Star,
  Twitter,
  X,
  Youtube,
  Zap
} from 'lucide-react'
import Logo from '../views/components/Logo'
import { getProductPreviewUrl } from '../lib/productCatalog'

const DEFAULT_PRODUCTS = [
  {
    _id: '',
    title: 'Wilderbots Systems',
    subtitle: 'AI systems, software delivery, and interactive learning experiences built for real teams.',
    description: 'We help teams design, ship, and scale practical digital systems across operations, products, and education.',
    ctaText: 'Start a Project'
  }
]

const DEFAULT_SERVICES = [
  {
    title: 'Lead qualification systems',
    description: 'Score incoming demand, route the right opportunities, and reduce manual triage.'
  },
  {
    title: 'Custom automation workflows',
    description: 'Connect your operational tools and shape real production logic around them.'
  }
]

const DEFAULT_STATS = [
  { value: '50k+', label: 'Projects delivered' },
  { value: '10k+', label: 'Builders reached' },
  { value: '35', label: 'Countries' },
  { value: '100+', label: 'Learning partners' }
]

const DEFAULT_REVIEWS = [
  {
    quote: 'Wilderbots helped us simplify delivery, ship faster, and keep the product experience sharp from day one.',
    name: 'Aarav Mehta',
    role: 'Product Lead',
    rating: 5
  },
  {
    quote: 'Their team translated complex service requirements into a clean web experience and a launch-ready workflow.',
    name: 'Riya Thomas',
    role: 'Operations Director',
    rating: 5
  },
  {
    quote: 'From application logic to frontend polish, the execution felt thoughtful, fast, and very hands-on.',
    name: 'Kabir Shah',
    role: 'Founder',
    rating: 5
  }
]

const toCompactLabel = (value) => {
  if (!value) return null
  const words = String(value)
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)

  if (!words.length) return null
  if (words.length === 1) return words[0].slice(0, 4).toUpperCase()
  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

const uniqueLabels = (values, fallback) => {
  const seen = new Set()
  const labels = []

  for (const value of values) {
    const label = toCompactLabel(value)
    if (!label || seen.has(label)) continue
    seen.add(label)
    labels.push(label)
  }

  return labels.length ? labels : fallback
}

const toReadableLabel = (value, fallback) => {
  if (!value) return fallback
  const cleaned = String(value).replace(/\s+/g, ' ').trim()
  return cleaned.length > 18 ? `${cleaned.slice(0, 16)}…` : cleaned
}

const stripHtml = (value) => String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

const getProductDestination = (product) => {
  if (!product) return '/products'
  const previewUrl = getProductPreviewUrl(product)
  if (previewUrl) return previewUrl
  if (product?.ctaLink) return product.ctaLink
  if (product?._id) return `/products/${product._id}`
  return '/products'
}

function MobileSnapCarousel({ items, activeIndex, setActiveIndex, renderItem, itemKey }) {
  const containerRef = useRef(null)

  const handleScroll = (event) => {
    const { scrollLeft, clientWidth } = event.currentTarget
    if (!clientWidth) return
    const nextIndex = Math.round(scrollLeft / clientWidth)
    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex)
    }
  }

  const scrollToIndex = (index) => {
    if (!containerRef.current) return
    containerRef.current.scrollTo({
      left: containerRef.current.clientWidth * index,
      behavior: 'smooth'
    })
    setActiveIndex(index)
  }

  return (
    <>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory items-stretch overflow-x-auto overflow-y-hidden px-6 touch-pan-x lg:hidden"
      >
        {items.map((item, index) => (
          <div key={itemKey(item, index)} className="flex w-full shrink-0 snap-center">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {items.length > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-2 lg:hidden">
          {items.map((item, index) => (
            <button
              key={`${itemKey(item, index)}-dot`}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index ? 'w-6 bg-sky-400' : 'w-2.5 bg-white/20'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </>
  )
}

const PRODUCT_SHOWCASE_ORDER = ['wilderlinks', 'valueshift', 'neureck']

const sortProductsForShowcase = (products = []) => {
  const getRank = (product) => {
    const key = String(product?.title || '').trim().toLowerCase()
    const index = PRODUCT_SHOWCASE_ORDER.indexOf(key)
    return index === -1 ? Number.MAX_SAFE_INTEGER : index
  }

  return [...products].sort((a, b) => {
    const rankDiff = getRank(a) - getRank(b)
    if (rankDiff !== 0) return rankDiff
    return 0
  })
}

function AnimatedBackgroundScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="wb-hero-core-glow" />
      <div className="wb-hero-core-vertical" />
      <div className="wb-hero-core-horizontal" />
      <div className="wb-top-shaft wb-top-shaft-one" />
      <div className="wb-top-shaft wb-top-shaft-two" />
      <div className="wb-top-shaft wb-top-shaft-three" />
      <div className="wb-unicorn-grid" />
      <div className="wb-unicorn-glow wb-unicorn-glow-one" />
      <div className="wb-unicorn-glow wb-unicorn-glow-two" />
      <div className="wb-unicorn-glow wb-unicorn-glow-three" />
      <div className="wb-unicorn-ring wb-unicorn-ring-one" />
      <div className="wb-unicorn-ring wb-unicorn-ring-two" />

      <svg
        className="absolute inset-0 h-full w-full opacity-70"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="wb-bg-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(56,189,248,0)" />
            <stop offset="50%" stopColor="rgba(56,189,248,0.9)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0)" />
          </linearGradient>
          <linearGradient id="wb-bg-road" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(56,189,248,0.28)" />
            <stop offset="50%" stopColor="rgba(59,130,246,0.22)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          <filter id="wb-bg-blur">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        <g className="wb-bg-drift-slow">
          <path
            d="M 180 1020 C 420 860, 620 690, 930 500 S 1380 190, 1680 20"
            fill="none"
            stroke="url(#wb-bg-road)"
            strokeWidth="54"
            strokeLinecap="round"
          />
          <path
            d="M 420 1040 C 650 840, 820 640, 1050 470 S 1410 250, 1700 90"
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="2"
            strokeDasharray="18 34"
          />
          <path
            d="M -120 860 C 170 760, 420 660, 650 470 S 1110 180, 1530 150"
            fill="none"
            stroke="rgba(30,41,59,0.62)"
            strokeWidth="28"
            strokeLinecap="round"
          />
        </g>

        <g className="wb-bg-drift-fast">
          <path
            d="M 980 1080 C 1010 830, 1100 650, 1290 420 S 1510 140, 1660 -40"
            fill="none"
            stroke="rgba(30,41,59,0.55)"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M 1040 1040 C 1090 860, 1170 700, 1330 480 S 1510 190, 1620 20"
            fill="none"
            stroke="url(#wb-bg-road)"
            strokeWidth="30"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>

        <g className="wb-bg-network">
          <circle cx="1180" cy="250" r="84" fill="rgba(56,189,248,0.14)" filter="url(#wb-bg-blur)" />
          <circle cx="1260" cy="180" r="6" fill="#67e8f9" />
          <circle cx="1360" cy="280" r="4" fill="#93c5fd" />
          <circle cx="1110" cy="360" r="5" fill="#818cf8" />
          <path d="M1260 180 L1360 280 L1110 360 Z" fill="none" stroke="url(#wb-bg-beam)" strokeWidth="2" />
          <path d="M1110 360 C1180 320, 1240 300, 1360 280" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        </g>

      </svg>
    </div>
  )
}

function AuraBackdrop() {
  useEffect(() => {
    let cancelled = false
    let retryTimer = null

    const initBackdrop = () => {
      if (cancelled || typeof window === 'undefined') return

      const studio = window.UnicornStudio
      if (studio && typeof studio.init === 'function') {
        try {
          studio.init()
          studio.isInitialized = true
          return
        } catch (error) {
          console.error('UnicornStudio init failed:', error)
        }
      }

      retryTimer = window.setTimeout(initBackdrop, 1200)
    }

    const existingScript = document.querySelector('script[data-unicorn-studio]')
    if (!existingScript) {
      const script = document.createElement('script')
      script.src =
        'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js'
      script.async = true
      script.dataset.unicornStudio = 'true'
      script.onload = initBackdrop
      document.body.appendChild(script)
    } else {
      initBackdrop()
    }

    return () => {
      cancelled = true
      if (retryTimer) window.clearTimeout(retryTimer)
    }
  }, [])

  return (
    <>
      <div
        className="aura-background-component fixed top-0 h-screen w-full z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)'
        }}
      >
        <div className="fixed inset-0 z-0 bg-black">
          <div
            className="aura-background-component absolute inset-0 h-full w-full"
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)',
              maskImage:
                'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%'
            }}
          >
            <div data-us-project="XxCmD31vVBmiINgvYCho" className="absolute inset-0 h-full w-full bg-neutral-950" />
          </div>
        </div>
      </div>
    </>
  )
}

export default function Home() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAllServices, setShowAllServices] = useState(false)
  const [products, setProducts] = useState(DEFAULT_PRODUCTS)
  const [services, setServices] = useState(DEFAULT_SERVICES)
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS)
  const [companyInfo, setCompanyInfo] = useState(null)
  const [emailAddresses, setEmailAddresses] = useState([])
  const [servicesCarouselIndex, setServicesCarouselIndex] = useState(0)

  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      try {
        const [productsRes, servicesRes, statsRes, companyInfoRes, emailAddressesRes, reviewsRes] = await Promise.allSettled([
          fetch('/api/product'),
          fetch('/api/services'),
          fetch('/api/stats'),
          fetch('/api/company-info'),
          fetch('/api/email-addresses'),
          fetch('/api/reviews')
        ])

        if (cancelled) return

        if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
          const data = await productsRes.value.json()
          if (Array.isArray(data) && data.length > 0) setProducts(data)
        }

        if (servicesRes.status === 'fulfilled' && servicesRes.value.ok) {
          const data = await servicesRes.value.json()
          if (Array.isArray(data.services) && data.services.length > 0) {
            setServices(data.services)
          }
        }

        if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
          const data = await statsRes.value.json()
          if (Array.isArray(data.stats) && data.stats.length > 0) {
            setStats(data.stats.slice(0, 4))
          }
        }

        if (companyInfoRes.status === 'fulfilled' && companyInfoRes.value.ok) {
          const data = await companyInfoRes.value.json()
          if (data?.companyInfo) {
            setCompanyInfo(data.companyInfo)
          }
        }

        if (emailAddressesRes.status === 'fulfilled' && emailAddressesRes.value.ok) {
          const data = await emailAddressesRes.value.json()
          if (Array.isArray(data.emailAddresses)) {
            setEmailAddresses(data.emailAddresses)
          }
        }

        if (reviewsRes.status === 'fulfilled' && reviewsRes.value.ok) {
          const data = await reviewsRes.value.json()
          if (Array.isArray(data.reviews) && data.reviews.length > 0) {
            setReviews(data.reviews)
          }
        }
      } catch (error) {
        console.error('Failed to load landing data', error)
      }
    }

    loadData()
    return () => {
      cancelled = true
    }
  }, [])

  const primaryProduct = products[0] || DEFAULT_PRODUCTS[0]
  const heroTitle = primaryProduct.title || DEFAULT_PRODUCTS[0].title
  const heroSubtitle = primaryProduct.subtitle || DEFAULT_PRODUCTS[0].subtitle
  const heroDescription = primaryProduct.description || DEFAULT_PRODUCTS[0].description
  const primaryCtaText = primaryProduct.ctaText || DEFAULT_PRODUCTS[0].ctaText
  const socialMedia = companyInfo?.socialMedia || {}
  const primaryEmail = emailAddresses.find((entry) => entry.isPrimary) || emailAddresses[0]
  const contactEmail = primaryEmail?.email || companyInfo?.email || 'hello@wilderbots.com'
  const companyName = companyInfo?.name || 'Wilderbots'
  const showcaseProducts = sortProductsForShowcase(products).slice(0, 3)
  const footerProducts = products.slice(0, 4)
  const prioritizedServices = useMemo(() => {
    const getServiceGroup = (service) => {
      const title = (service?.title || '').toLowerCase()
      if (title.includes('application') || title.includes('app')) return 'application'
      if (title.includes('web')) return 'web'
      return 'other'
    }

    const rankService = (service) => {
      const group = getServiceGroup(service)
      if (group === 'application') return 0
      if (group === 'web') return 1
      return 2
    }

    return [...services].sort((a, b) => rankService(a) - rankService(b))
  }, [services])
  const productFeatureTitles = useMemo(
    () => (primaryProduct?.features || []).map((feature) => feature?.title).filter(Boolean),
    [primaryProduct]
  )
  const serviceToolLabels = useMemo(
    () =>
      prioritizedServices
        .slice(0, 4)
        .map((service, index) =>
          toReadableLabel(service?.title, ['Applications', 'Web Delivery', 'Software Ops', 'AI Systems'][index] || 'Service')
        ),
    [prioritizedServices]
  )
  const processingLabels = useMemo(
    () => ['Discovery', 'Design', 'Build', 'Launch'],
    []
  )
  const solutionTitle = `${companyName} systems`
  const solutionNarrative = `${companyName} service delivery flow`
  const solutionDescription =
    'We connect application builds, web experiences, and delivery systems into one clear operating layer.'
  const solutionSecondaryCopy =
    `${companyName} services, product features, and company data shape this section now, without borrowing copy from any one branded product.`
  const featuredServices = useMemo(() => {
    const applicationService = prioritizedServices.find((service) => {
      const title = (service?.title || '').toLowerCase()
      return title.includes('application') || title.includes('app')
    })
    const webService = prioritizedServices.find((service) => {
      const title = (service?.title || '').toLowerCase()
      return title.includes('web')
    })

    return [applicationService, webService].filter(Boolean)
  }, [prioritizedServices])
  const solutionPrimaryFeature = featuredServices[0]?.title || 'Application delivery'
  const solutionFeatureLine = featuredServices
    .map((service) => service?.title)
    .filter(Boolean)
    .join(' • ') || 'Application Development • Web Development'
  const solutionEventLabel = featuredServices
    .map((service) => service?.title)
    .filter(Boolean)
    .join(' + ') || 'Application Development + Web Development'
  const extraServices = useMemo(() => {
    const featuredKeys = new Set(featuredServices.map((service) => service?._id || service?.title))
    return prioritizedServices.filter((service) => !featuredKeys.has(service?._id || service?.title))
  }, [featuredServices, prioritizedServices])
  const solutionSummaryLabel = extraServices[0]?.title || solutionPrimaryFeature
  const goToProductsPage = () => {
    router.push('/products')
  }

  const goToOrder = () => {
    router.push('/contact')
  }

  return (
    <>
      <Head>
        <title>Wilderbots - Wilder than Imagination</title>
        <meta
          name="description"
          content="Wilderbots builds AI systems, software services, and interactive education experiences with a cinematic interface."
        />
        <link rel="icon" href="/logo-alone.png" type="image/png" />
      </Head>
      <AuraBackdrop />

      <div className="min-h-screen bg-[#09090b] p-0 text-white antialiased selection:bg-sky-500/30 selection:text-sky-200 lg:bg-[#020408] lg:p-8">
        <div className="fixed inset-0 z-[1] bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.018),transparent_24%),radial-gradient(circle_at_78%_30%,rgba(59,130,246,0.014),transparent_26%),linear-gradient(180deg,rgba(4,7,13,0.05)_0%,rgba(2,4,8,0.14)_100%)]" />
        <div className="fixed inset-0 z-[2] opacity-14 [mask-image:linear-gradient(to_bottom,black,black_80%,transparent)]">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
        <div className="fixed inset-0 z-[3] opacity-80 mix-blend-screen">
          <AnimatedBackgroundScene />
        </div>

        <main className="relative z-10 flex min-h-screen w-full flex-col overflow-hidden bg-black/20 backdrop-blur-xl lg:mx-auto lg:min-h-[900px] lg:max-w-[1400px] lg:rounded-[2.5rem] lg:border lg:border-white/10 lg:shadow-2xl lg:shadow-black">
          <div className="pointer-events-none absolute inset-0 z-0 flex justify-between px-6 opacity-50 md:px-12 md:opacity-100">
            <div className="h-full w-px bg-white/5" />
            <div className="hidden h-full w-px bg-white/5 sm:block" />
            <div className="hidden h-full w-px bg-white/5 md:block" />
            <div className="hidden h-full w-px bg-white/5 lg:block" />
            <div className="hidden h-full w-px bg-white/5 xl:block" />
            <div className="h-full w-px bg-white/5" />
          </div>

          <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => router.push('/')} className="flex items-center gap-2" aria-label="Go to homepage">
                <Logo size={62} showText={true} className="scale-[1.02]" />
              </button>
            </div>

            <div
              className="relative hidden items-center gap-1 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(54,60,71,0.52)_0%,rgba(17,20,27,0.54)_100%)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_45px_rgba(0,0,0,0.34)] backdrop-blur-[22px] md:flex"
            >
              <div className="pointer-events-none absolute inset-[1px] rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_56%)] opacity-80" />
              <a href="#services" className="relative rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.08)_100%)] px-5 py-1.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_2px_10px_rgba(0,0,0,0.18)]">
                Services
              </a>
              <a href="#solutions" className="relative px-5 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                Solutions
              </a>
              <a href="#showcase" className="relative px-5 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                Products
              </a>
              <Link href="/about" className="relative px-5 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                About
              </Link>
            </div>

            <button
              type="button"
              onClick={goToOrder}
              className="hidden items-center gap-2 rounded-full bg-gradient-to-b from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow-[0px_0px_0px_1px_rgba(37,99,235,1),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all hover:from-blue-500 hover:to-blue-600 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] sm:flex"
            >
              <span>{primaryCtaText}</span>
              <ArrowRight className="h-4 w-4 text-blue-100" />
            </button>

            <button
              type="button"
              className="text-zinc-400 hover:text-white md:hidden"
              onClick={() => setMobileMenuOpen((value) => !value)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>

          {mobileMenuOpen ? (
            <div className="relative z-50 mx-6 mb-4 rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(31,35,44,0.78)_0%,rgba(10,12,18,0.82)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_45px_rgba(0,0,0,0.38)] backdrop-blur-[24px] md:hidden">
              <div className="flex flex-col gap-2">
                <a href="#services" className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white">
                  Services
                </a>
                <a href="#solutions" className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white">
                  Solutions
                </a>
                <a href="#showcase" className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white">
                  Products
                </a>
                <Link href="/about" className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white">
                  About
                </Link>
                <button
                  type="button"
                  onClick={goToOrder}
                  className="mt-2 rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white"
                >
                  {primaryCtaText}
                </button>
              </div>
            </div>
          ) : null}

          <div className="relative z-20 flex h-full flex-1 flex-col md:flex-row">
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#09090b]/90 via-[#09090b]/60 to-transparent md:hidden" />

            <div className="z-30 flex h-full w-full flex-col justify-start px-6 pb-12 pt-8 md:w-[50%] md:justify-between md:px-12 md:pt-24 lg:w-[45%]">
              <div className="pointer-events-auto mx-auto max-w-xl md:mx-0">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-medium tracking-wide text-sky-300 shadow-[0_0_10px_rgba(14,165,233,0.15)]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                  WILDERBOTS SYSTEMS
                </div>

                <h1 className="mb-8 font-serif-custom text-6xl font-normal leading-[0.95] tracking-tight text-white drop-shadow-2xl sm:text-6xl md:mb-8 md:text-6xl md:leading-[0.9] lg:text-8xl">
                  Wilder than
                  <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text pr-2 italic text-transparent">
                    {' '}imagination
                  </span>
                </h1>

                <p className="mb-8 max-w-md text-lg font-light leading-relaxed text-zinc-400 md:mb-12 md:text-xl lg:text-2xl">
                  {heroSubtitle}
                </p>

                <div className="mb-16 flex w-full flex-none flex-col gap-4 sm:flex-row md:mb-20">
                  <button
                    type="button"
                    onClick={goToOrder}
                    className="group relative inline-flex w-full flex-none items-center justify-center overflow-hidden rounded-full p-[1px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(14,165,233,0.3)] sm:w-auto"
                  >
                    <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#38bdf8_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="absolute inset-0 rounded-full bg-zinc-800 transition-opacity duration-300 group-hover:opacity-0" />
                    <span className="relative z-10 flex h-full w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 px-8 py-3.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                      <span>{primaryCtaText}</span>
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </button>

                  <Link
                    href="/services"
                    className="group relative inline-flex w-full flex-none items-center justify-center overflow-hidden rounded-full p-[1px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] sm:w-auto"
                  >
                    <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#a1a1aa_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="absolute inset-0 rounded-full bg-zinc-800 transition-opacity duration-300 group-hover:opacity-0" />
                    <span className="relative z-10 flex h-full w-full items-center justify-center gap-2 rounded-full bg-black px-8 py-3.5 text-sm font-medium text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group-hover:text-white">
                      <span>Explore services</span>
                    </span>
                  </Link>
                </div>

                <div
                  className="mt-auto border-t border-white/10 pt-8"
                  style={{
                    WebkitMaskImage: 'linear-gradient(90deg, transparent, black 5%, black 70%, transparent)',
                    maskImage: 'linear-gradient(90deg, transparent, black 5%, black 70%, transparent)'
                  }}
                >
                  <p className="mb-6 ml-4 text-center text-xs font-semibold uppercase tracking-widest text-zinc-500 md:text-left">
                    {companyName} across software, AI, and education
                  </p>
                  <div className="ml-4 flex flex-wrap items-center justify-center gap-8 opacity-50 invert brightness-200 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 md:justify-start md:gap-10">
                    {stats.map((stat) => (
                      <div key={stat.label} className="min-w-[80px]">
                        <div className="text-2xl font-semibold text-black">{stat.value}</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-black/60">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 z-0 h-full w-full overflow-hidden opacity-40 md:opacity-100">
              <svg className="h-full w-full" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="roadGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#0ea5e9', stopOpacity: 0.3 }} />
                    <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 0.2 }} />
                    <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>

                <path id="pathMain" d="M 400 1000 C 600 900, 900 600, 1300 200" fill="none" />

                <g className="hidden lg:block">
                  <rect x="580" y="600" width="120" height="400" rx="60" transform="rotate(-15 640 800)" fill="none" stroke="#3f3f46" strokeWidth="0.5" opacity="0.3" />
                  <rect x="580" y="600" width="120" height="400" rx="60" transform="rotate(-15 640 800)" fill="none" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" className="animate-beam" opacity="0.5" />
                  <rect x="880" y="300" width="140" height="450" rx="70" transform="rotate(-25 950 525)" fill="none" stroke="#3f3f46" strokeWidth="0.5" opacity="0.3" />
                  <rect x="880" y="300" width="140" height="450" rx="70" transform="rotate(-25 950 525)" fill="none" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" className="animate-beam" opacity="0.5" style={{ animationDelay: '-3s' }} />
                  <rect x="1050" y="50" width="100" height="300" rx="50" transform="rotate(-35 1100 200)" fill="none" stroke="#3f3f46" strokeWidth="0.5" opacity="0.3" />
                  <rect x="1050" y="50" width="100" height="300" rx="50" transform="rotate(-35 1100 200)" fill="none" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" className="animate-beam" opacity="0.5" style={{ animationDelay: '-6s' }} />
                </g>

                <path d="M 600 1000 C 700 900, 800 700, 1300 550" fill="none" stroke="#1e293b" strokeWidth="30" opacity="0.3" strokeLinecap="round" />
                <path d="M 900 1000 C 950 900, 900 700, 1300 450" fill="none" stroke="#1e293b" strokeWidth="20" opacity="0.3" strokeLinecap="round" />
                <path d="M 400 1000 C 600 900, 900 600, 1300 200" fill="none" stroke="url(#roadGradient)" strokeWidth="50" opacity="0.8" strokeLinecap="butt" />
                <path d="M 400 1000 C 600 900, 900 600, 1300 200" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="20 40" opacity="0.6" />

                <rect x="-30" y="-15" width="60" height="30" rx="4" fill="#0ea5e9" opacity="0.95" filter="drop-shadow(0 0 10px rgba(14,165,233,0.5))">
                  <animateMotion dur="5s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                    <mpath href="#pathMain" />
                  </animateMotion>
                </rect>
              </svg>

              <div className="absolute bottom-12 right-8 z-40 hidden origin-bottom-left animate-float md:block lg:left-[52%] lg:right-auto lg:bottom-[12%]">
                <div className="relative z-10 flex w-52 flex-col gap-3 rounded-xl border border-white/10 bg-zinc-900/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800 text-[10px] font-bold text-zinc-400">01</span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-200">Ingest</span>
                    </div>
                    <Zap className="h-4 w-4 text-zinc-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-4 w-4 items-center justify-center rounded border border-orange-500/20 bg-orange-900/30 text-[10px] text-orange-400">B</div>
                        <span className="text-[10px] font-medium text-zinc-400">Client Brief</span>
                      </div>
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-400">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-4 w-4 items-center justify-center rounded border border-blue-500/20 bg-blue-900/30 text-[10px] text-blue-400">
                          <Database className="h-3 w-3" />
                        </div>
                        <span className="text-[10px] font-medium text-zinc-400">Project Scope</span>
                      </div>
                      <span className="text-[9px] text-zinc-600">Reviewing</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute right-8 bottom-[12rem] z-40 hidden origin-bottom-right animate-float delay-200 md:block lg:right-[25%] lg:bottom-[40%]">
                <div className="relative z-10 flex w-56 flex-col gap-3 rounded-xl border border-white/10 bg-zinc-900/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800 text-[10px] font-bold text-zinc-400">02</span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-200">Build</span>
                    </div>
                    <Cpu className="h-4 w-4 text-zinc-500" />
                  </div>
                  <div className="rounded border border-white/5 bg-black/40 p-2.5">
                    <div className="mb-1 flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-red-500/40" />
                      <div className="h-2 w-2 rounded-full bg-yellow-500/40" />
                      <div className="h-2 w-2 rounded-full bg-green-500/40" />
                    </div>
                    <p className="font-mono text-[10px] leading-tight text-zinc-400">
                      <span className="text-purple-400">WILDERBOTS</span> build <span className="text-purple-400">WHEN</span> goals align
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute right-8 bottom-[20rem] z-40 hidden origin-bottom-right animate-float md:block lg:right-[10%] lg:top-[15%] lg:bottom-auto">
                <div className="relative z-10 flex w-52 flex-col gap-3 rounded-xl border border-white/10 bg-zinc-900/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800 text-[10px] font-bold text-zinc-400">03</span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-200">Launch</span>
                    </div>
                    <Server className="h-4 w-4 text-zinc-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span className="text-xs font-medium text-zinc-400">Delivery Active</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-zinc-500">Stage</span>
                    <span className="font-mono text-xs font-medium text-emerald-400">Go-live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-20 flex w-full flex-col border-t border-white/5">
            <section id="services" className="relative mx-auto w-full max-w-[1400px] bg-black/50 px-6 py-24 md:px-12 lg:py-32">
              <div className="mx-auto mb-20 max-w-5xl text-center">
                <h2 className="mb-8 overflow-visible pb-4 font-serif-custom text-3xl font-normal leading-[1.12] tracking-tight text-white md:text-6xl">
                  <span className="block">Services built around</span>
                  <span className="mt-2 block bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text italic leading-[1.08] text-transparent md:mt-3">
                    real deployments
                  </span>
                </h2>
                <p className="text-lg font-light leading-relaxed text-zinc-400 md:text-xl">
                  Your homepage now highlights application and web work first from the live services collection, with
                  everything else tucked behind a show more option.
                </p>
              </div>

              <MobileSnapCarousel
                items={[0, 1]}
                activeIndex={servicesCarouselIndex}
                setActiveIndex={setServicesCarouselIndex}
                itemKey={(item) => `featured-service-${item}`}
                renderItem={(item) =>
                  item === 0 ? (
                    <div className="group relative mr-5 flex w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/20 transition-colors duration-500 hover:border-white/20">
                      <div className="relative z-10 flex flex-1 flex-col p-8 md:p-10">
                        <h3 className="mb-3 flex items-center gap-3 text-2xl font-medium tracking-tight text-white">
                          <Sparkles className="h-7 w-7 text-sky-400" />
                          {featuredServices[0]?.title || DEFAULT_SERVICES[0].title}
                        </h3>
                        <p className="mb-12 text-base font-light leading-relaxed text-zinc-400">
                          {featuredServices[0]?.description || DEFAULT_SERVICES[0].description}
                        </p>

                        <div className="relative mt-auto flex h-[320px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-black/12">
                          <div
                            className="absolute inset-0 z-0 opacity-30"
                            style={{
                              backgroundImage:
                                'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                              backgroundSize: '30px 30px',
                              transform: 'perspective(500px) rotateX(60deg) translateY(50px) scale(1.5)'
                            }}
                          />

                          <div
                            className="relative z-20 mb-10 flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-300 md:gap-4 md:text-xs"
                            style={{
                              WebkitMaskImage: 'linear-gradient(90deg, transparent, black 5%, black 90%, transparent)',
                              maskImage: 'linear-gradient(90deg, transparent, black 5%, black 90%, transparent)'
                            }}
                          >
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 shadow-lg backdrop-blur-sm">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                                iOS
                              </div>
                              <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 shadow-lg backdrop-blur-sm">
                                <span className="delay-75 h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500" />
                                Android
                              </div>
                            </div>

                            <svg className="h-12 w-8 text-zinc-600" viewBox="0 0 32 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M0 12 C 16 12, 16 24, 32 24" strokeDasharray="3 3" className="opacity-50" />
                              <path d="M0 36 C 16 36, 16 24, 32 24" strokeDasharray="3 3" className="opacity-50" />
                            </svg>

                            <div className="z-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 px-3 py-2 font-semibold text-white shadow-xl">
                              ships product
                            </div>

                            <svg className="h-12 w-8 text-zinc-600" viewBox="0 0 32 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M0 24 C 16 24, 16 12, 32 12" strokeDasharray="3 3" className="opacity-50" />
                              <path d="M0 24 C 16 24, 16 36, 32 36" strokeDasharray="3 3" className="opacity-50" />
                            </svg>

                            <div className="flex flex-col gap-3">
                              <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-zinc-500 shadow-lg backdrop-blur-sm">
                                cross-platform
                              </div>
                              <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-zinc-500 shadow-lg backdrop-blur-sm">
                                production ready
                              </div>
                            </div>
                          </div>

                          <div className="absolute bottom-8 z-10 flex w-full justify-center gap-4 px-10">
                            <span className="-rotate-2 cursor-default select-none rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[10px] text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] backdrop-blur-sm transition-transform hover:scale-105">
                              Mobile UI
                            </span>
                            <span className="rotate-3 cursor-default select-none rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[10px] text-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.2)] backdrop-blur-sm transition-transform hover:scale-105">
                              API Layer
                            </span>
                            <span className="-translate-y-2 cursor-default select-none rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[10px] text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] backdrop-blur-sm transition-transform hover:scale-105">
                              App Launch
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="group relative mr-5 flex w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/20 transition-colors duration-500 hover:border-white/20">
                      <div className="relative z-10 flex h-full flex-col p-8 md:p-10">
                        <h3 className="mb-3 flex items-center gap-3 text-2xl font-medium tracking-tight text-white">
                          <Cpu className="h-7 w-7 text-sky-400" />
                          {featuredServices[1]?.title || DEFAULT_SERVICES[1].title}
                        </h3>
                        <p className="mb-8 text-base font-light leading-relaxed text-zinc-400">
                          {featuredServices[1]?.description || DEFAULT_SERVICES[1].description}
                        </p>

                        {!!(featuredServices[1]?.features || featuredServices[1]?.services)?.length ? (
                          <div className="mb-8 flex flex-wrap gap-3">
                            {(featuredServices[1]?.features || featuredServices[1]?.services || []).slice(0, 4).map((item, index) => (
                              <span
                                key={`${item}-${index}`}
                                className="rounded-full border border-sky-500/20 bg-sky-500/8 px-3 py-1 text-[11px] font-medium text-sky-200"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        <div className="relative mt-auto w-full overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e] p-5 shadow-2xl transition-shadow duration-500 group-hover:shadow-indigo-500/10">
                          <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold tracking-wide text-white">Web Stack</span>
                              <span className="rounded-md border border-white/5 bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400">live setup</span>
                            </div>
                            <div className="flex gap-1.5">
                              <div className="h-2 w-2 rounded-full bg-zinc-700" />
                              <div className="h-2 w-2 rounded-full bg-zinc-700" />
                            </div>
                          </div>

                          <div className="relative z-10 space-y-3 font-mono text-[10px] sm:text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-10 text-right font-medium text-zinc-500">Type</span>
                              <div className="flex h-7 flex-1 items-center rounded border border-white/10 bg-zinc-900 px-2 text-sky-300 transition-colors group-hover:border-white/20">
                                landing pages
                              </div>
                              <div className="flex h-7 w-8 items-center justify-center rounded border border-white/10 bg-zinc-900 text-zinc-400">+</div>
                              <div className="flex h-7 w-20 items-center rounded border border-white/10 bg-zinc-900 px-2 text-[10px] text-white">
                                portals
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="w-10 text-right font-medium text-zinc-500">Built</span>
                              <div className="flex h-7 flex-1 items-center rounded border border-white/10 bg-zinc-900 px-2 text-sky-300 transition-colors group-hover:border-white/20">
                                responsive UI
                              </div>
                              <div className="flex h-7 w-8 items-center justify-center rounded border border-white/10 bg-zinc-900 text-zinc-400">{'>'}</div>
                              <div className="flex h-7 w-20 items-center rounded border border-white/10 bg-zinc-900 px-2 text-emerald-400">
                                shipped
                              </div>
                            </div>

                            <div className="relative mt-2 border-l border-zinc-800 pl-4 pt-2">
                              <span className="absolute top-5 -left-[17px] h-px w-4 bg-zinc-800" />
                              <div className="mb-2 flex items-center gap-2">
                                <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Output</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-10 text-right font-medium text-zinc-500">Focus</span>
                                <div className="flex h-7 flex-1 items-center rounded border border-white/10 bg-zinc-900 px-2 text-sky-300">conversion + clarity</div>
                                <div className="flex h-7 w-8 items-center justify-center rounded border border-white/10 bg-zinc-900 text-zinc-400">in</div>
                                <div className="flex h-7 w-20 items-center rounded border border-white/10 bg-zinc-900 px-2 text-[10px] text-orange-400">
                                  production
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="relative z-10 mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-lg border border-white/8 bg-zinc-900/80 px-3 py-2">
                              <div className="mb-1 text-[9px] uppercase tracking-[0.2em] text-zinc-600">Frontend</div>
                              <div className="text-xs text-zinc-300">Responsive build</div>
                            </div>
                            <div className="rounded-lg border border-white/8 bg-zinc-900/80 px-3 py-2">
                              <div className="mb-1 text-[9px] uppercase tracking-[0.2em] text-zinc-600">Delivery</div>
                              <div className="text-xs text-zinc-300">Launch ready</div>
                            </div>
                          </div>

                          <div className="pointer-events-none absolute -right-5 -bottom-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-[40px] transition-all duration-700 group-hover:bg-indigo-500/20" />
                        </div>
                      </div>
                    </div>
                  )
                }
              />

              <div className="hidden grid-cols-1 gap-8 lg:grid lg:grid-cols-2">
                <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/20 transition-colors duration-500 hover:border-white/20">
                  <div className="relative z-10 flex flex-1 flex-col p-8 md:p-10">
                    <h3 className="mb-3 flex items-center gap-3 text-2xl font-medium tracking-tight text-white">
                      <Sparkles className="h-7 w-7 text-sky-400" />
                      {featuredServices[0]?.title || DEFAULT_SERVICES[0].title}
                    </h3>
                    <p className="mb-12 text-base font-light leading-relaxed text-zinc-400">
                      {featuredServices[0]?.description || DEFAULT_SERVICES[0].description}
                    </p>

                    <div className="relative mt-auto flex h-[320px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-black/12">
                      <div
                        className="absolute inset-0 z-0 opacity-30"
                        style={{
                          backgroundImage:
                            'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                          backgroundSize: '30px 30px',
                          transform: 'perspective(500px) rotateX(60deg) translateY(50px) scale(1.5)'
                        }}
                      />

                      <div
                        className="relative z-20 mb-10 flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-300 md:gap-4 md:text-xs"
                        style={{
                          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 5%, black 90%, transparent)',
                          maskImage: 'linear-gradient(90deg, transparent, black 5%, black 90%, transparent)'
                        }}
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 shadow-lg backdrop-blur-sm">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                            iOS
                          </div>
                          <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 shadow-lg backdrop-blur-sm">
                            <span className="delay-75 h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500" />
                            Android
                          </div>
                        </div>

                        <svg className="h-12 w-8 text-zinc-600" viewBox="0 0 32 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M0 12 C 16 12, 16 24, 32 24" strokeDasharray="3 3" className="opacity-50" />
                          <path d="M0 36 C 16 36, 16 24, 32 24" strokeDasharray="3 3" className="opacity-50" />
                        </svg>

                        <div className="z-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 px-3 py-2 font-semibold text-white shadow-xl">
                          ships product
                        </div>

                        <svg className="h-12 w-8 text-zinc-600" viewBox="0 0 32 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M0 24 C 16 24, 16 12, 32 12" strokeDasharray="3 3" className="opacity-50" />
                          <path d="M0 24 C 16 24, 16 36, 32 36" strokeDasharray="3 3" className="opacity-50" />
                        </svg>

                        <div className="flex flex-col gap-3">
                          <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-zinc-500 shadow-lg backdrop-blur-sm">
                            cross-platform
                          </div>
                          <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-zinc-500 shadow-lg backdrop-blur-sm">
                            production ready
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-8 z-10 flex w-full justify-center gap-4 px-10">
                        <span className="-rotate-2 cursor-default select-none rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[10px] text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] backdrop-blur-sm transition-transform hover:scale-105">
                          Mobile UI
                        </span>
                        <span className="rotate-3 cursor-default select-none rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[10px] text-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.2)] backdrop-blur-sm transition-transform hover:scale-105">
                          API Layer
                        </span>
                        <span className="-translate-y-2 cursor-default select-none rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[10px] text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] backdrop-blur-sm transition-transform hover:scale-105">
                          App Launch
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/20 transition-colors duration-500 hover:border-white/20">
                  <div className="relative z-10 flex h-full flex-col p-8 md:p-10">
                    <h3 className="mb-3 flex items-center gap-3 text-2xl font-medium tracking-tight text-white">
                      <Cpu className="h-7 w-7 text-sky-400" />
                      {featuredServices[1]?.title || DEFAULT_SERVICES[1].title}
                    </h3>
                    <p className="mb-8 text-base font-light leading-relaxed text-zinc-400">
                      {featuredServices[1]?.description || DEFAULT_SERVICES[1].description}
                    </p>

                    {!!(featuredServices[1]?.features || featuredServices[1]?.services)?.length ? (
                      <div className="mb-8 flex flex-wrap gap-3">
                        {(featuredServices[1]?.features || featuredServices[1]?.services || []).slice(0, 4).map((item, index) => (
                          <span
                            key={`${item}-${index}`}
                            className="rounded-full border border-sky-500/20 bg-sky-500/8 px-3 py-1 text-[11px] font-medium text-sky-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="relative mt-auto w-full overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e] p-5 shadow-2xl transition-shadow duration-500 group-hover:shadow-indigo-500/10">
                      <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold tracking-wide text-white">Web Stack</span>
                          <span className="rounded-md border border-white/5 bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400">live setup</span>
                        </div>
                        <div className="flex gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-zinc-700" />
                          <div className="h-2 w-2 rounded-full bg-zinc-700" />
                        </div>
                      </div>

                      <div className="relative z-10 space-y-3 font-mono text-[10px] sm:text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-10 text-right font-medium text-zinc-500">Type</span>
                          <div className="flex h-7 flex-1 items-center rounded border border-white/10 bg-zinc-900 px-2 text-sky-300 transition-colors group-hover:border-white/20">
                            landing pages
                          </div>
                          <div className="flex h-7 w-8 items-center justify-center rounded border border-white/10 bg-zinc-900 text-zinc-400">+</div>
                          <div className="flex h-7 w-20 items-center rounded border border-white/10 bg-zinc-900 px-2 text-[10px] text-white">
                            portals
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="w-10 text-right font-medium text-zinc-500">Built</span>
                          <div className="flex h-7 flex-1 items-center rounded border border-white/10 bg-zinc-900 px-2 text-sky-300 transition-colors group-hover:border-white/20">
                            responsive UI
                          </div>
                          <div className="flex h-7 w-8 items-center justify-center rounded border border-white/10 bg-zinc-900 text-zinc-400">{'>'}</div>
                          <div className="flex h-7 w-20 items-center rounded border border-white/10 bg-zinc-900 px-2 text-emerald-400">
                            shipped
                          </div>
                        </div>

                        <div className="relative mt-2 border-l border-zinc-800 pl-4 pt-2">
                          <span className="absolute top-5 -left-[17px] h-px w-4 bg-zinc-800" />
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Output</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-10 text-right font-medium text-zinc-500">Focus</span>
                            <div className="flex h-7 flex-1 items-center rounded border border-white/10 bg-zinc-900 px-2 text-sky-300">conversion + clarity</div>
                            <div className="flex h-7 w-8 items-center justify-center rounded border border-white/10 bg-zinc-900 text-zinc-400">in</div>
                            <div className="flex h-7 w-20 items-center rounded border border-white/10 bg-zinc-900 px-2 text-[10px] text-orange-400">
                              production
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10 mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-white/8 bg-zinc-900/80 px-3 py-2">
                          <div className="mb-1 text-[9px] uppercase tracking-[0.2em] text-zinc-600">Frontend</div>
                          <div className="text-xs text-zinc-300">Responsive build</div>
                        </div>
                        <div className="rounded-lg border border-white/8 bg-zinc-900/80 px-3 py-2">
                          <div className="mb-1 text-[9px] uppercase tracking-[0.2em] text-zinc-600">Delivery</div>
                          <div className="text-xs text-zinc-300">Launch ready</div>
                        </div>
                      </div>

                      <div className="pointer-events-none absolute -right-5 -bottom-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-[40px] transition-all duration-700 group-hover:bg-indigo-500/20" />
                    </div>
                  </div>
                </div>
              </div>

              {extraServices.length > 0 ? (
                <div className="mt-10 flex flex-col items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setShowAllServices((value) => !value)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/10"
                  >
                    {showAllServices ? 'Show less' : 'Show more'}
                    <ChevronRight className={`h-4 w-4 transition-transform ${showAllServices ? 'rotate-90' : ''}`} />
                  </button>

                  {showAllServices ? (
                    <div className="grid w-full gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {extraServices.map((service) => (
                        <div
                          key={service._id || service.title}
                          className="rounded-2xl border border-white/10 bg-zinc-900/30 p-6 backdrop-blur-md"
                        >
                          <div className="mb-3 text-sm font-semibold text-white">{service.title}</div>
                          <p className="text-sm leading-relaxed text-zinc-400">{service.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>

            <div className="relative z-20 flex w-full flex-col border-t border-white/5">
              <section id="solutions" className="relative mx-auto w-full max-w-[1400px] px-6 pt-20 pb-8 md:px-12 md:py-24 lg:py-32">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                  <div className="order-2 max-w-xl lg:order-1">
                    <h2 className="mb-6 font-serif-custom text-3xl font-normal tracking-tight text-white md:text-6xl">
                      Built around
                      <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text italic text-transparent">
                        {' '}{solutionTitle}
                      </span>
                    </h2>
                    <p className="mb-8 text-lg font-light leading-relaxed text-zinc-400">
                      {solutionDescription}
                    </p>
                    <p className="mb-10 text-base font-light leading-relaxed text-zinc-500">
                      {solutionSecondaryCopy}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <Link href="/services" className="inline-flex items-center gap-2 border-b border-sky-500 pb-0.5 text-sm font-medium text-white transition-colors hover:text-sky-400">
                        Explore {companyName}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="order-1 relative w-full lg:order-2">
                    <div className="relative mx-auto mr-auto ml-auto w-full max-w-lg lg:mr-0">
                      <div className="mb-6 flex justify-between px-4 text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                        <span>Connected Tools</span>
                        <span className="mr-12">{companyName} Workflow</span>
                      </div>

                      <div className="relative mb-12 flex items-center justify-between px-2">
                        <div className="flex gap-3 md:gap-4">
                          {(serviceToolLabels.length ? serviceToolLabels : ['Applications', 'Web', 'Software', 'AI']).map((label) => (
                            <div key={label} className="group flex h-12 min-w-[5.75rem] items-center justify-center rounded-xl border border-white/10 bg-zinc-900 px-3 text-white/50 shadow-lg transition-all duration-300 hover:scale-105 hover:border-white/20 hover:text-white">
                              <span className="text-xs font-semibold">{label}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-3 border-l border-dashed border-white/5 pl-8 md:gap-4">
                          {processingLabels.map((label) => (
                            <div key={label} className="group flex h-12 min-w-[5.75rem] items-center justify-center rounded-xl border border-white/10 bg-zinc-900 px-3 text-white/50 shadow-lg transition-all duration-300 hover:scale-105 hover:border-white/20 hover:text-white">
                              <span className="text-xs font-semibold">{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="absolute top-10 left-0 z-0 hidden h-[180px] w-full pointer-events-none sm:block">
                        <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 512 180">
                          <path d="M 32 24 C 32 80, 256 40, 256 120" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1.5" />
                          <path d="M 92 24 C 92 80, 256 40, 256 120" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1.5" />
                          <path d="M 152 24 C 152 80, 256 40, 256 120" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1.5" />
                          <path d="M 212 24 C 212 80, 256 40, 256 120" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1.5" />
                          <path d="M 360 24 C 360 80, 256 40, 256 120" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1.5" />
                          <path d="M 420 24 C 420 80, 256 40, 256 120" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1.5" />
                          <path d="M 480 24 C 480 80, 256 40, 256 120" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1.5" />

                          <path d="M 32 24 C 32 80, 256 40, 256 120" fill="none" stroke="url(#line-gradient)" strokeWidth="1.5" className="animate-beam" />
                          <path d="M 92 24 C 92 80, 256 40, 256 120" fill="none" stroke="url(#line-gradient)" strokeWidth="1.5" className="animate-beam" style={{ animationDelay: '-1s' }} />
                          <path d="M 152 24 C 152 80, 256 40, 256 120" fill="none" stroke="url(#line-gradient)" strokeWidth="1.5" className="animate-beam" style={{ animationDelay: '-2s' }} />
                          <path d="M 212 24 C 212 80, 256 40, 256 120" fill="none" stroke="url(#line-gradient)" strokeWidth="1.5" className="animate-beam" style={{ animationDelay: '-3s' }} />
                          <path d="M 360 24 C 360 80, 256 40, 256 120" fill="none" stroke="url(#line-gradient)" strokeWidth="1.5" className="animate-beam" style={{ animationDelay: '-1.5s' }} />
                          <path d="M 420 24 C 420 80, 256 40, 256 120" fill="none" stroke="url(#line-gradient)" strokeWidth="1.5" className="animate-beam" style={{ animationDelay: '-2.5s' }} />
                          <path d="M 480 24 C 480 80, 256 40, 256 120" fill="none" stroke="url(#line-gradient)" strokeWidth="1.5" className="animate-beam" style={{ animationDelay: '-0.5s' }} />

                          <circle cx="256" cy="120" r="3" fill="#6366f1" className="animate-pulse">
                            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                          </circle>
                          <line x1="256" y1="120" x2="256" y2="160" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
                        </svg>
                      </div>

                      <div className="relative z-10 mt-16 flex flex-col items-center gap-6">
                        <div className="group relative w-full rounded-2xl border border-white/5 bg-zinc-900/62 p-5 shadow-2xl backdrop-blur-md">
                          <div className="absolute top-8 -left-px h-8 w-[3px] rounded-r-full bg-indigo-500" />
                          <div className="flex items-start gap-4">
                            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                              <Sparkles className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-center justify-between">
                                <h4 className="font-mono text-sm font-medium text-white">Service request received</h4>
                                <span className="font-mono text-[10px] text-zinc-500">24ms</span>
                              </div>
                              <p className="truncate font-mono text-xs leading-relaxed text-zinc-400 opacity-70">
                                {solutionEventLabel}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="relative flex flex-col items-center">
                          <div className="h-6 w-px border-r border-dashed border-zinc-700 bg-gradient-to-b from-white/10 to-transparent" />
                          <div className="z-20 my-2 flex items-center gap-2 rounded-full border border-zinc-800 bg-black px-3 py-1.5 shadow-xl">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                            <span className="font-mono text-[10px] font-medium text-zinc-400">WILDERBOTS CORE</span>
                          </div>
                          <div className="h-6 w-px border-r border-dashed border-zinc-700 bg-gradient-to-b from-transparent to-white/10" />
                        </div>

                        <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] p-5 shadow-2xl">
                          <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-sky-500/5 blur-3xl" />
                          <div className="mb-4 flex items-center gap-3">
                            <Database className="h-5 w-5 text-neutral-50" />
                            <span className="text-sm font-medium text-zinc-200">{solutionNarrative}</span>
                            <div className="ml-auto flex gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                              <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-zinc-900/50 p-3">
                            <div className="min-w-0 flex items-center gap-3">
                              <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                              <div className="min-w-0 flex flex-col">
                                <span className="truncate text-xs font-medium text-white">{solutionSummaryLabel}</span>
                                <span className="truncate font-mono text-[10px] text-zinc-500">
                                  {solutionFeatureLine}
                                </span>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <span className="rounded border border-white/5 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                                Wilderbots
                              </span>
                              <div className="flex h-6 w-6 items-center justify-center rounded border border-white/5 bg-zinc-800">
                                <span className="text-[10px] text-zinc-400">{Math.max(1, productFeatureTitles.length || 1)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="relative flex w-full flex-col border-t border-white/5 bg-[linear-gradient(180deg,rgba(3,7,18,0.74)_0%,rgba(2,5,14,0.88)_100%)]">
              <section id="reviews" className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-8 md:px-12 md:py-18 lg:py-20">
                <div className="mb-6 flex flex-col items-center justify-center gap-5 text-center md:mb-10">
                  <div className="max-w-3xl">
                    <div className="mb-4 inline-flex items-center rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-300">
                      Client Reviews
                    </div>
                    <h2 className="font-serif-custom text-3xl font-normal leading-[0.95] tracking-tight text-white md:text-5xl">
                      Proof from
                      <span className="block bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text italic text-transparent md:inline">
                        real delivery
                      </span>
                    </h2>
                  </div>
                </div>

                <div
                  className={`no-scrollbar -mx-6 flex snap-x gap-5 overflow-y-hidden px-6 pb-2 touch-pan-x md:mx-0 md:px-0 ${
                    reviews.slice(0, 3).length === 1
                      ? 'justify-center overflow-x-hidden md:justify-start md:overflow-x-auto'
                      : 'overflow-x-auto'
                  }`}
                  style={{
                    WebkitMaskImage: 'linear-gradient(90deg, transparent, black 6%, black 94%, transparent)',
                    maskImage: 'linear-gradient(90deg, transparent, black 6%, black 94%, transparent)'
                  }}
                >
                  {reviews.slice(0, 3).map((review, index) => {
                    const reviewerName = review?.name || `Client ${index + 1}`
                    const initials = reviewerName
                      .split(' ')
                      .map((part) => part[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()

                    return (
                      <article
                        key={review?._id || `${reviewerName}-${index}`}
                        className="group relative min-w-[300px] max-w-[320px] snap-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-900/28 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-colors duration-300 hover:border-white/20 md:min-w-[340px] md:max-w-[340px]"
                      >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.10),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
                        <div className="relative z-10 flex h-full flex-col">
                          <div className="mb-5 flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              {review?.avatar ? (
                                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10">
                                  <Image
                                    src={review.avatar}
                                    alt={reviewerName}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-500/20 bg-sky-500/10 text-xs font-semibold text-sky-200">
                                  {initials}
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-semibold text-white md:text-base">{reviewerName}</div>
                                <div className="text-xs text-zinc-500 md:text-sm">{review?.role || 'Wilderbots client'}</div>
                              </div>
                            </div>
                            <Quote className="h-8 w-8 text-white/10 transition-colors group-hover:text-sky-300/20" />
                          </div>

                          <div className="mb-4 flex gap-1">
                            {Array.from({ length: Number(review?.rating) || 5 }).map((_, starIndex) => (
                              <Star key={starIndex} className="h-3.5 w-3.5 fill-sky-300 text-sky-300" />
                            ))}
                          </div>

                          <p className="line-clamp-6 text-base font-light leading-relaxed text-zinc-300">
                            “{(review?.quote || review?.review || 'Strong execution, thoughtful service flow, and a product team that keeps momentum high.').trim()}”
                          </p>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            </div>

            <div className="relative flex w-full flex-col border-t border-white/5 bg-black/50">
              <div className="pointer-events-none absolute inset-0 z-0 flex justify-between px-6 opacity-50 md:px-12 md:opacity-100">
                <div className="h-full w-px bg-white/5" />
                <div className="hidden h-full w-px bg-white/5 sm:block" />
                <div className="hidden h-full w-px bg-white/5 md:block" />
                <div className="hidden h-full w-px bg-white/5 lg:block" />
                <div className="hidden h-full w-px bg-white/5 xl:block" />
                <div className="h-full w-px bg-white/5" />
              </div>

              <section id="showcase" className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pt-10 pb-10 md:px-12 md:py-24 lg:py-32">
                <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                  <h2 className="max-w-3xl font-serif-custom text-4xl font-normal leading-[0.95] tracking-tight text-white md:text-6xl">
                    Explore
                    <span className="block italic text-zinc-500">Wilderbots products</span>
                  </h2>
                  <div className="flex shrink-0 gap-3">
                    <button type="button" onClick={goToProductsPage} className="group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition-all hover:bg-zinc-200">
                      View products
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <Link href="/contact" className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-5 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-zinc-800">
                      Contact team
                    </Link>
                  </div>
                </div>

                <div
                  className="no-scrollbar -mx-6 flex snap-x gap-6 overflow-x-auto overflow-y-hidden px-6 pb-12 pt-4 touch-pan-x md:mx-0 md:pl-12"
                  style={{
                    WebkitMaskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
                    maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)'
                  }}
                >
                  {showcaseProducts.map((product, index) => {
                    const featureTitles = (product?.features || []).map((feature) => feature?.title).filter(Boolean)
                    const topFeatures = featureTitles.slice(0, 3)
                    const productLabel = `By ${companyName}`
                    const previewUrl = getProductPreviewUrl(product)
                    const productDestination = getProductDestination(product)
                    const openInNewTab = /^https?:\/\//.test(productDestination)

                    return (
                      <div
                        key={product?._id || `${product?.title}-${index}`}
                        className="group/card min-w-[320px] snap-center cursor-pointer transition-transform duration-500 ease-out hover:-translate-y-2 md:min-w-[440px]"
                      >
                        <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] transition-all duration-500 group-hover/card:border-white/20 group-hover/card:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
                          {openInNewTab ? (
                            <a
                              href={productDestination}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${product.title} in a new tab`}
                              className="absolute inset-0 z-30"
                            />
                          ) : (
                            <Link
                              href={productDestination}
                              aria-label={`Open ${product.title}`}
                              className="absolute inset-0 z-30"
                            />
                          )}
                          <div className="flex h-8 w-full items-center gap-1.5 border-b border-white/5 bg-zinc-900/50 px-4 backdrop-blur-sm">
                            <div className="h-2 w-2 rounded-full bg-zinc-600/50" />
                            <div className="h-2 w-2 rounded-full bg-zinc-600/50" />
                            <div className="h-2 w-2 rounded-full bg-zinc-600/50" />
                            <div className="ml-4 h-4 w-28 rounded-full bg-zinc-800/50" />
                          </div>

                          {previewUrl ? (
                            <div className="relative h-full overflow-hidden bg-[#0b0d12]">
                              <div className="pointer-events-none absolute inset-0 origin-top-left scale-[0.5] overflow-hidden" style={{ width: '200%', height: '200%' }}>
                                <iframe
                                  src={previewUrl}
                                  title={`${product.title} website preview`}
                                  className="h-full w-full border-0 bg-white"
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,15,0.02)_0%,rgba(5,8,15,0.06)_40%,rgba(5,8,15,0.28)_100%)]" />
                              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/75 to-transparent" />
                            </div>
                          ) : null}

                          {!previewUrl && index % 3 === 0 ? (
                            <div className="relative h-full overflow-hidden bg-gradient-to-br from-zinc-900 to-black p-6">
                              <div className="relative z-10 flex h-full flex-col gap-4">
                                <h3 className="text-xl font-medium tracking-tight text-white">{product.title}</h3>
                                <p className="line-clamp-3 text-sm text-zinc-400">{product.subtitle}</p>
                                {topFeatures.length ? (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {topFeatures.slice(0, 2).map((feature, featureIndex) => (
                                      <span
                                        key={`${feature}-${featureIndex}`}
                                        className="rounded border border-sky-500/20 bg-sky-500/10 px-2 py-1 font-mono text-[10px] text-sky-200"
                                      >
                                        {feature}
                                      </span>
                                    ))}
                                  </div>
                                ) : null}
                                <div className="mt-auto flex h-24 w-full items-end gap-1 rounded border border-white/5 bg-zinc-800/50 p-2">
                                  {(topFeatures.length ? topFeatures : [product.title, product.edition, companyName]).slice(0, 5).map((item, featureIndex) => (
                                    <div
                                      key={`${item}-${featureIndex}`}
                                      className="rounded-sm bg-gradient-to-t from-sky-500/80 to-indigo-400/40 transition-all duration-500"
                                      style={{
                                        width: `${100 / Math.min(5, Math.max(3, (topFeatures.length ? topFeatures : [1, 2, 3]).length))}%`,
                                        height: `${38 + (featureIndex % 3) * 18}%`
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : null}

                          {!previewUrl && index % 3 === 1 ? (
                            <div className="relative h-full overflow-hidden bg-zinc-900 p-6">
                              <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl transition-colors duration-500 group-hover/card:bg-emerald-500/10" />
                              <div className="relative z-10">
                                <h3 className="text-xl font-medium tracking-tight text-white">{product.title}</h3>
                                <p className="mt-2 line-clamp-3 text-sm text-zinc-400">{product.subtitle}</p>
                                <div className="mt-8 space-y-2 font-mono text-[10px] text-zinc-500">
                                  {(topFeatures.length ? topFeatures : [product.edition, productLabel, product.ctaText]).slice(0, 3).map((feature, featureIndex) => (
                                    <div key={`${feature}-${featureIndex}`} className="flex items-center gap-2">
                                      <span className="text-emerald-400">✓</span>
                                      <span>{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : null}

                          {!previewUrl && index % 3 === 2 ? (
                            <div className="relative flex h-full items-center justify-center overflow-hidden bg-zinc-900 p-6">
                              <div className="relative flex h-40 w-full max-w-[240px] flex-col justify-between rounded-xl border border-dashed border-zinc-700 p-4 transition-colors group-hover/card:border-zinc-500">
                                <div className="absolute inset-0 bg-sky-500/5 transition-colors group-hover/card:bg-sky-500/10" />
                                <div className="relative z-10 flex items-center justify-between">
                                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{product.edition}</span>
                                  <div className="flex h-8 w-8 items-center justify-center rounded bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.5)] transition-transform group-hover/card:scale-110">
                                    <Zap className="h-4 w-4" />
                                  </div>
                                </div>
                                <div className="relative z-10">
                                  <div className="mb-2 font-mono text-xs text-sky-200">{product.title}</div>
                                  <div className="space-y-2">
                                    {(topFeatures.length ? topFeatures : [product.subtitle]).slice(0, 2).map((feature, featureIndex) => (
                                      <div key={`${feature}-${featureIndex}`} className="rounded border border-white/10 bg-black/40 px-2 py-1 text-[10px] text-zinc-400">
                                        {feature}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-3 px-1">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-white transition-colors group-hover/card:border-white/30">
                            {index % 3 === 0 ? <Cpu className="h-5 w-5" /> : index % 3 === 1 ? <Sparkles className="h-5 w-5" /> : <Server className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{productLabel}</div>
                            <div className="text-xs text-zinc-500">{product.edition}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              <section className="relative z-10 mx-auto w-full max-w-[1400px] border-b border-white/5 bg-black/50 px-6 pb-24 pt-32 md:px-12">
                <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                  <h2 className="mb-8 font-serif-custom text-5xl font-normal tracking-tight text-white drop-shadow-2xl md:text-7xl lg:text-8xl">
                    Ready to build with
                    <span className="animate-gradient-x bg-gradient-to-r from-sky-300 via-indigo-400 to-sky-300 bg-[length:200%_200%] bg-clip-text pr-2 italic text-transparent">
                      {' '}{companyName}?
                    </span>
                  </h2>
                  <p className="mb-12 max-w-2xl text-lg font-light text-zinc-400 md:text-xl">
                    {heroDescription}
                  </p>
                  <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                    <button
                      type="button"
                      onClick={goToOrder}
                      className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-semibold text-black transition-all hover:scale-105 hover:bg-zinc-200"
                    >
                      <span className="mr-2">{primaryCtaText}</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    <Link
                      href="/contact"
                      className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-zinc-900 px-8 font-semibold text-white transition-all hover:border-white/20 hover:bg-zinc-800"
                    >
                      Contact Wilderbots
                    </Link>
                  </div>
                </div>
              </section>

              <footer className="relative z-10 mx-auto w-full max-w-[1400px] bg-black/50 px-6 pb-16 pt-16 md:px-12">
                <div className="mb-16 grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-6">
                  <div className="col-span-2 pr-8 lg:col-span-2">
                    <div className="mb-6">
                      <Logo size={78} showText={true} className="brightness-110" />
                    </div>
                    <p className="mb-6 text-sm leading-relaxed text-zinc-500">
                      {heroSubtitle}
                    </p>
                    <div className="flex gap-4">
                      {socialMedia.linkedin ? (
                        <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-500 transition-colors hover:text-white" aria-label="LinkedIn">
                          <Linkedin className="h-[18px] w-[18px]" />
                        </a>
                      ) : null}
                      {socialMedia.github ? (
                        <a href={socialMedia.github} target="_blank" rel="noopener noreferrer" className="text-zinc-500 transition-colors hover:text-white" aria-label="GitHub">
                          <Github className="h-[18px] w-[18px]" />
                        </a>
                      ) : null}
                      {socialMedia.twitter ? (
                        <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-500 transition-colors hover:text-white" aria-label="Twitter">
                          <Twitter className="h-[18px] w-[18px]" />
                        </a>
                      ) : null}
                      {socialMedia.instagram ? (
                        <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-zinc-500 transition-colors hover:text-white" aria-label="Instagram">
                          <Instagram className="h-[18px] w-[18px]" />
                        </a>
                      ) : null}
                      {socialMedia.youtube ? (
                        <a href={socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="text-zinc-500 transition-colors hover:text-white" aria-label="YouTube">
                          <Youtube className="h-[18px] w-[18px]" />
                        </a>
                      ) : null}
                      <a href={`mailto:${contactEmail}`} className="text-zinc-500 transition-colors hover:text-white" aria-label="Email">
                        <Mail className="h-[18px] w-[18px]" />
                      </a>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4 text-sm font-semibold text-white">Product</h4>
                    <ul className="space-y-3 text-sm text-zinc-500">
                      {footerProducts.map((product) => (
                        <li key={product._id || product.title}>
                          <Link href={`/products/${product._id || '69c03ecaad257115941e6117'}`} className="transition-colors hover:text-sky-400">
                            {product.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-4 text-sm font-semibold text-white">Resources</h4>
                    <ul className="space-y-3 text-sm text-zinc-500">
                      <li><Link href="/faq" className="transition-colors hover:text-sky-400">FAQ</Link></li>
                      <li><Link href="/services" className="transition-colors hover:text-sky-400">Services</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
                    <ul className="space-y-3 text-sm text-zinc-500">
                      <li><Link href="/about" className="transition-colors hover:text-sky-400">About Us</Link></li>
                      <li><Link href="/careers" className="transition-colors hover:text-sky-400">Careers</Link></li>
                      <li><Link href="/contact" className="transition-colors hover:text-sky-400">Contact</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
                    <ul className="space-y-3 text-sm text-zinc-500">
                      <li><Link href="/privacy" className="transition-colors hover:text-sky-400">Privacy Policy</Link></li>
                      <li><Link href="/terms" className="transition-colors hover:text-sky-400">Terms of Service</Link></li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-between border-t border-white/5 pt-8 text-xs text-zinc-600 md:flex-row">
                  <p>© 2026 Wilderbots Technologies Private Limited. All rights reserved.</p>
                  <div className="mt-4 flex gap-6 md:mt-0">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {contactEmail}
                    </span>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
