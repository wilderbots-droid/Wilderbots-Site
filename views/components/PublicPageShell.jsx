import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Github, Instagram, Linkedin, Mail, Twitter, Youtube } from 'lucide-react'
import Logo from './Logo'

const DEFAULT_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
]

export default function PublicPageShell({
  title,
  eyebrow,
  description,
  onBack,
  children,
  actions,
  heroContentClassName = '',
  contentClassName = '',
}) {
  const [companyInfo, setCompanyInfo] = useState(null)
  const [emailAddresses, setEmailAddresses] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        const [companyResponse, emailResponse, productsResponse] = await Promise.all([
          fetch('/api/company-info'),
          fetch('/api/email-addresses'),
          fetch('/api/product')
        ])

        if (companyResponse.ok) {
          const data = await companyResponse.json()
          setCompanyInfo(data.companyInfo)
        }

        if (emailResponse.ok) {
          const data = await emailResponse.json()
          setEmailAddresses(data.emailAddresses || [])
        }

        if (productsResponse.ok) {
          const data = await productsResponse.json()
          setProducts(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('Failed to load public shell footer data', error)
      }
    }

    loadFooterData()
  }, [])

  const socialMedia = companyInfo?.socialMedia || {}
  const primaryEmail = emailAddresses.find((entry) => entry.isPrimary) || emailAddresses[0]
  const contactEmail = primaryEmail?.email || companyInfo?.email || 'hello@wilderbots.com'
  const heroSubtitle =
    companyInfo?.heroSubtitle ||
    'Building across software, AI systems, and education experiences. Product. Service. Education.'
  const footerProducts = products.slice(0, 4)

  return (
    <div className="min-h-screen bg-[#09090b] p-0 text-white antialiased selection:bg-sky-500/30 selection:text-sky-200 lg:bg-[#020408] lg:p-8">
      <div className="fixed inset-0 z-[1] bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.10),transparent_26%),radial-gradient(circle_at_70%_24%,rgba(59,130,246,0.08),transparent_28%),radial-gradient(circle_at_34%_78%,rgba(96,165,250,0.06),transparent_30%),linear-gradient(180deg,rgba(4,7,13,0.06)_0%,rgba(2,4,8,0.16)_100%)]" />
      <div className="fixed inset-0 z-[2] opacity-20 [mask-image:linear-gradient(to_bottom,black,black_82%,transparent)]">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.024)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.024)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      <div className="fixed inset-0 z-[3] overflow-hidden">
        <div className="absolute left-[-10%] top-[10%] h-[28rem] w-[28rem] rounded-full bg-sky-400/14 blur-[110px]" />
        <div className="absolute right-[-6%] top-[20%] h-[20rem] w-[20rem] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute inset-x-0 top-[18%] mx-auto h-px w-[64%] bg-gradient-to-r from-transparent via-sky-300/25 to-transparent" />
      </div>

      <main className="relative z-10 flex min-h-screen w-full flex-col overflow-hidden bg-black/22 lg:mx-auto lg:min-h-[900px] lg:max-w-[1400px] lg:rounded-[2.5rem] lg:border lg:border-white/10 lg:backdrop-blur-md lg:shadow-2xl lg:shadow-black/70">
        <div className="pointer-events-none absolute inset-0 z-0 flex justify-between px-6 opacity-50 md:px-12 md:opacity-100">
          <div className="h-full w-px bg-white/5" />
          <div className="hidden h-full w-px bg-white/5 sm:block" />
          <div className="hidden h-full w-px bg-white/5 md:block" />
          <div className="hidden h-full w-px bg-white/5 lg:block" />
          <div className="hidden h-full w-px bg-white/5 xl:block" />
          <div className="h-full w-px bg-white/5" />
        </div>

        <header className="relative z-20 border-b border-white/5 px-6 py-6 md:px-12 md:py-8">
          <div className="flex flex-col gap-5 lg:min-h-[72px] lg:justify-center">
            <div className="flex items-center justify-between gap-4 lg:relative lg:block">
              <div className="flex items-center justify-between gap-4 lg:absolute lg:left-0 lg:top-1/2 lg:w-auto lg:-translate-y-1/2 lg:justify-start">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex h-14 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <Link href="/" className="inline-flex items-center">
                <Logo size={52} showText={true} />
              </Link>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:justify-center">
                {DEFAULT_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex h-14 items-center rounded-full border border-white/10 bg-white/[0.03] px-6 text-sm text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex justify-start lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:justify-end">
              <Link
                href="/contact"
                className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#2f6df6] to-[#2452d9] px-7 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-transform hover:scale-[1.01]"
              >
                Book a Call
              </Link>
              </div>
            </div>
          </div>
        </header>

        <section className={`relative z-10 border-b border-white/5 px-6 py-16 md:px-12 md:py-24 ${heroContentClassName}`}>
          <div className="max-w-4xl">
            {eyebrow ? (
              <div className="mb-6 inline-flex items-center rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-300">
                {eyebrow}
              </div>
            ) : null}
            <h1 className="max-w-5xl font-serif-custom text-4xl font-normal leading-[0.95] tracking-tight text-white md:text-7xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-8 max-w-3xl text-lg font-light leading-relaxed text-zinc-400 md:text-xl">
                {description}
              </p>
            ) : null}
            {actions ? <div className="mt-10 flex flex-wrap gap-4">{actions}</div> : null}
          </div>
        </section>

        <div className={`relative z-10 flex-1 px-6 py-12 md:px-12 md:py-16 ${contentClassName}`}>{children}</div>

        <footer className="relative z-10 bg-black/50 px-6 pb-16 pt-16 md:px-12">
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
                    <Link href={`/products/${product._id || ''}`} className="transition-colors hover:text-sky-400">
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
      </main>
    </div>
  )
}
