import { useEffect, useMemo, useRef, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Globe,
  Layers3,
  Package2,
  Sparkles,
} from 'lucide-react'
import PublicPageShell from '../../views/components/PublicPageShell'
import { getProductPreviewConfig, getProductPreviewUrl } from '../../lib/productCatalog'

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
        className="no-scrollbar flex snap-x snap-mandatory items-stretch overflow-x-auto overflow-y-hidden touch-pan-x md:hidden"
      >
        {items.map((item, index) => (
          <div key={itemKey(item, index)} className="flex w-full shrink-0 snap-center">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {items.length > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-2 md:hidden">
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

export default function ProductDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [metaIndex, setMetaIndex] = useState(0)
  const [featureIndex, setFeatureIndex] = useState(0)

  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product?id=${id}`)
        const data = await response.json()
        if (response.ok) {
          setProduct(data)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const previewUrl = useMemo(() => getProductPreviewUrl(product), [product])
  const previewConfig = useMemo(() => getProductPreviewConfig(product), [product])
  const featureTitles = useMemo(
    () => (product?.features || []).map((feature) => feature?.title).filter(Boolean),
    [product]
  )
  const metaCards = useMemo(
    () => [
      {
        icon: Package2,
        label: 'Edition',
        value: product?.edition || 'Wilderbots'
      },
      {
        icon: Layers3,
        label: 'Feature Count',
        value: `${featureTitles.length || 1} modules`
      },
      {
        icon: Globe,
        label: 'Launch Route',
        value: previewUrl ? 'Live site available' : 'Internal showcase'
      },
      {
        icon: ArrowRight,
        label: 'CTA',
        value: product?.ctaText || `Explore ${product?.title || 'product'}`
      }
    ],
    [featureTitles.length, previewUrl, product]
  )

  const openPrimaryAction = () => {
    if (!product?.ctaLink) {
      router.push('/contact')
      return
    }

    if (product.ctaLink.startsWith('http')) {
      window.open(product.ctaLink, '_blank', 'noopener,noreferrer')
      return
    }

    router.push(product.ctaLink)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070c] text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-sky-400" />
      </div>
    )
  }

  if (!product) {
    return (
      <>
        <Head>
          <title>Product Not Found - Wilderbots</title>
        </Head>
        <PublicPageShell
          onBack={() => router.push('/products')}
          eyebrow="Products"
          title="Product not found"
          description="This product is no longer available or the link is incorrect."
          actions={
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
            >
              Back to products
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          <div className="rounded-[2rem] border border-white/10 bg-black/25 p-8 text-zinc-400">
            Browse the full Wilderbots product collection from the products page.
          </div>
        </PublicPageShell>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{product.title} - Wilderbots</title>
        <meta name="description" content={product.subtitle || product.description} />
      </Head>

      <PublicPageShell
        onBack={() => router.push('/products')}
        eyebrow={product.edition || 'Product'}
        title={
          <>
            {product.title}
            <span className="block bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text italic text-transparent">
              product system
            </span>
          </>
        }
        description={product.subtitle || product.description}
        actions={
          <>
            {previewUrl ? (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 sm:w-auto"
              >
                Open live site
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : product.showCta !== false ? (
              <button
                type="button"
                onClick={openPrimaryAction}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 sm:w-auto"
              >
                {product.ctaText || `Open ${product.title}`}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : null}
          </>
        }
      >
        <div className="space-y-6 md:space-y-8">
          <section className="grid min-w-0 items-stretch gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:gap-8">
            <article className="flex min-w-0 h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.82)_0%,rgba(7,10,18,0.96)_100%)]">
              <div className="border-b border-white/10 px-5 py-4 md:px-6">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.26em] text-zinc-500">
                  <span>Live Preview</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>By Wilderbots</span>
                </div>
              </div>

              <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#0b0d12]">
                <div className="flex h-8 w-full items-center gap-1.5 border-b border-white/5 bg-zinc-900/50 px-4 backdrop-blur-sm">
                  <div className="h-2 w-2 rounded-full bg-zinc-600/50" />
                  <div className="h-2 w-2 rounded-full bg-zinc-600/50" />
                  <div className="h-2 w-2 rounded-full bg-zinc-600/50" />
                  <div className="ml-4 h-4 w-28 rounded-full bg-zinc-800/50" />
                </div>

                {previewUrl ? (
                  <div
                    className="relative h-[520px] min-h-[520px] flex-1 overflow-hidden sm:h-[620px] sm:min-h-[620px] md:h-[680px] md:min-h-[680px] xl:h-full xl:min-h-0"
                  >
                    <div
                      className="absolute overflow-hidden"
                      style={{
                        top: previewConfig.top,
                        left: previewConfig.left,
                        width: `${100 / previewConfig.scale}%`,
                        height: `${100 / previewConfig.scale}%`,
                        transform: `scale(${previewConfig.scale})`,
                        transformOrigin: 'top left'
                      }}
                    >
                      <iframe
                        src={previewUrl}
                        title={`${product.title} live preview`}
                        className="h-full w-full border-0 bg-white"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,15,0.02)_0%,rgba(5,8,15,0.06)_40%,rgba(5,8,15,0.24)_100%)]" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/70 to-transparent" />
                  </div>
                ) : product.image ? (
                  <div className="relative min-h-[320px] flex-1 md:min-h-0">
                    <Image src={product.image} alt={product.title} fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="flex min-h-0 flex-1 items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.16),transparent_24%),linear-gradient(180deg,rgba(8,12,20,1),rgba(6,8,14,1))]">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-8 py-6 text-center backdrop-blur-sm">
                      <div className="mb-2 text-sm uppercase tracking-[0.24em] text-sky-200">{product.edition}</div>
                      <div className="font-serif-custom text-3xl text-white">{product.title}</div>
                    </div>
                  </div>
                )}
              </div>
            </article>

            <div className="min-w-0 h-full space-y-6">
              <article className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md md:p-6">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-sky-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  Product Story
                </div>
                <p className="min-w-0 break-words text-base leading-relaxed text-zinc-300">
                  {product.detailedOverview || product.description || product.subtitle}
                </p>
              </article>

              <MobileSnapCarousel
                items={metaCards}
                activeIndex={metaIndex}
                setActiveIndex={setMetaIndex}
                itemKey={(item, index) => `${item.label}-${index}`}
                renderItem={(item) => (
                  <article className="flex min-w-0 w-full flex-col rounded-[1.6rem] border border-white/10 bg-black/25 p-5">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sky-300">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="text-sm uppercase tracking-[0.18em] text-zinc-500">{item.label}</div>
                    <div className="mt-2 min-w-0 break-words text-lg font-semibold text-white">{item.value}</div>
                  </article>
                )}
              />

              <div className="hidden gap-4 sm:grid sm:grid-cols-2">
                {metaCards.map((item, index) => (
                  <article key={`${item.label}-${index}`} className="min-w-0 rounded-[1.6rem] border border-white/10 bg-black/25 p-5">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sky-300">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="text-sm uppercase tracking-[0.18em] text-zinc-500">{item.label}</div>
                    <div className="mt-2 min-w-0 break-words text-lg font-semibold text-white">{item.value}</div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {featureTitles.length ? (
            <section className="rounded-[2rem] border border-white/10 bg-black/20 p-5 md:p-8">
              <div className="mb-6 flex flex-col gap-4 md:mb-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-500">Core Capabilities</div>
                  <h2 className="font-serif-custom text-3xl text-white md:text-5xl">What powers {product.title}</h2>
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
                  Every detail below is being pulled from the product record, so this page now stays in sync with the actual product content instead of using old static UI blocks.
                </p>
              </div>

              <MobileSnapCarousel
                items={product.features || []}
                activeIndex={featureIndex}
                setActiveIndex={setFeatureIndex}
                itemKey={(feature, index) => `${feature?.title || 'feature'}-${index}`}
                renderItem={(feature, index) => (
                  <article
                    key={`${feature?.title || 'feature'}-${index}`}
                    className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,38,0.9)_0%,rgba(8,11,18,0.98)_100%)] p-6"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-200">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <h3 className="mb-3 text-2xl font-semibold text-white">{feature?.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-400">{feature?.description || 'Feature details are managed from the product dashboard.'}</p>
                  </article>
                )}
              />

              <div className="hidden gap-5 md:grid md:grid-cols-2 xl:grid-cols-3">
                {(product.features || []).map((feature, index) => (
                  <article
                    key={`${feature?.title || 'feature'}-${index}`}
                    className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,38,0.9)_0%,rgba(8,11,18,0.98)_100%)] p-6"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-200">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <h3 className="mb-3 text-2xl font-semibold text-white">{feature?.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-400">{feature?.description || 'Feature details are managed from the product dashboard.'}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {(product.appStoreLink || product.playStoreLink || product.showCta !== false) ? (
            <section className="rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,23,35,0.92)_0%,rgba(7,10,18,0.96)_100%)] p-6 text-center md:p-12">
              <div className="mx-auto max-w-3xl">
                <div className="mb-4 text-xs uppercase tracking-[0.24em] text-zinc-500">Next Step</div>
                <h2 className="font-serif-custom text-4xl text-white md:text-6xl">Take {product.title} further</h2>
                <p className="mt-5 text-base leading-relaxed text-zinc-400 md:text-lg">
                  Open the live experience, continue to the product CTA, or explore the app store destinations attached to this product.
                </p>
              </div>

              <div className="mt-8 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                {previewUrl ? (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
                  >
                    Open live site
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : product.showCta !== false ? (
                  <button
                    type="button"
                    onClick={openPrimaryAction}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
                  >
                    {product.ctaText || `Open ${product.title}`}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : null}

                {product.appStoreLink ? (
                  <a
                    href={product.appStoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    App Store
                  </a>
                ) : null}

                {product.playStoreLink ? (
                  <a
                    href={product.playStoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    Google Play
                  </a>
                ) : null}
              </div>
            </section>
          ) : null}
        </div>
      </PublicPageShell>
    </>
  )
}
