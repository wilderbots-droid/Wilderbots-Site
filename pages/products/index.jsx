import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/router'
import PublicPageShell from '../../views/components/PublicPageShell'
import { getProductPreviewUrl } from '../../lib/productCatalog'

export default function ProductsIndexPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/product')
        const data = await response.json()
        if (Array.isArray(data)) {
          setProducts(data)
        }
      } catch (error) {
        console.error('Failed to load products', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const getPrimaryProductAction = (product) => {
    return {
      href: `/products/${product._id}`,
      label: `Explore ${product.title}`,
      external: false,
      icon: ArrowRight
    }
  }

  return (
    <>
      <Head>
        <title>Products - Wilderbots</title>
        <meta name="description" content="Explore all Wilderbots products, platforms, and product systems." />
      </Head>

      <PublicPageShell
        onBack={() => router.push('/')}
        eyebrow="Products"
        title={
          <>
            Explore every
            <span className="block bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text italic text-transparent">
              Wilderbots product
            </span>
          </>
        }
        description="Browse the full product lineup, open live sites where available, and jump into each dedicated product page."
      >
        <section className="rounded-[2rem] border border-white/10 bg-zinc-950/35 px-6 py-12 backdrop-blur-xl md:px-8">
          {loading ? (
            <div className="py-16 text-center text-zinc-400">Loading products...</div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {products.map((product) => {
                const featureTitles = (product?.features || []).map((feature) => feature?.title).filter(Boolean)
                const primaryAction = getPrimaryProductAction(product)
                const PrimaryIcon = primaryAction.icon

                return (
                  <article
                    key={product._id}
                    className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,38,0.88)_0%,rgba(8,11,18,0.96)_100%)]"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10 bg-[#0b0d12]">
                      {getProductPreviewUrl(product) ? (
                        <div className="absolute inset-0 origin-top-left scale-[0.5] overflow-hidden" style={{ width: '200%', height: '200%' }}>
                          <iframe
                            src={getProductPreviewUrl(product)}
                            title={`${product.title} preview`}
                            className="h-full w-full border-0 bg-white"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : null}
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,15,0.02)_0%,rgba(5,8,15,0.08)_45%,rgba(5,8,15,0.36)_100%)]" />
                    </div>

                    <div className="p-7">
                      <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-500">{product.edition}</div>
                      <h2 className="mb-3 font-serif-custom text-3xl font-normal text-white">{product.title}</h2>
                      <p className="mb-5 text-base leading-relaxed text-zinc-400">{product.subtitle}</p>

                      {featureTitles.length ? (
                        <div className="mb-6 flex flex-wrap gap-2">
                          {featureTitles.slice(0, 4).map((feature, index) => (
                            <span
                              key={`${feature}-${index}`}
                              className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-200"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="flex flex-wrap gap-3">
                        {primaryAction.external ? (
                          <a
                            href={primaryAction.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
                          >
                            {primaryAction.label}
                            <PrimaryIcon className="h-4 w-4" />
                          </a>
                        ) : (
                          <Link
                            href={primaryAction.href}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
                          >
                            {primaryAction.label}
                            <PrimaryIcon className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </PublicPageShell>
    </>
  )
}
