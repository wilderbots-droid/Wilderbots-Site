import { useEffect, useMemo, useState } from 'react'
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

export default function ProductDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

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
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
              >
                Open live site
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : product.showCta !== false ? (
              <button
                type="button"
                onClick={openPrimaryAction}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
              >
                {product.ctaText || `Open ${product.title}`}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : null}
          </>
        }
      >
        <div className="space-y-8">
          <section className="grid items-stretch gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.82)_0%,rgba(7,10,18,0.96)_100%)]">
              <div className="border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.26em] text-zinc-500">
                  <span>Live Preview</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>By Wilderbots</span>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col bg-[#0b0d12]">
                <div className="flex h-8 w-full items-center gap-1.5 border-b border-white/5 bg-zinc-900/50 px-4 backdrop-blur-sm">
                  <div className="h-2 w-2 rounded-full bg-zinc-600/50" />
                  <div className="h-2 w-2 rounded-full bg-zinc-600/50" />
                  <div className="h-2 w-2 rounded-full bg-zinc-600/50" />
                  <div className="ml-4 h-4 w-28 rounded-full bg-zinc-800/50" />
                </div>

                {previewUrl ? (
                  <div
                    className="relative min-h-0 flex-1 overflow-hidden"
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
                  <div className="relative min-h-0 flex-1">
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

            <div className="h-full space-y-6">
              <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-sky-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  Product Story
                </div>
                <p className="text-base leading-relaxed text-zinc-300">
                  {product.detailedOverview || product.description || product.subtitle}
                </p>
              </article>

              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-[1.6rem] border border-white/10 bg-black/25 p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sky-300">
                    <Package2 className="h-5 w-5" />
                  </div>
                  <div className="text-sm uppercase tracking-[0.18em] text-zinc-500">Edition</div>
                  <div className="mt-2 text-lg font-semibold text-white">{product.edition || 'Wilderbots'}</div>
                </article>

                <article className="rounded-[1.6rem] border border-white/10 bg-black/25 p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sky-300">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <div className="text-sm uppercase tracking-[0.18em] text-zinc-500">Feature Count</div>
                  <div className="mt-2 text-lg font-semibold text-white">{featureTitles.length || 1} modules</div>
                </article>

                <article className="rounded-[1.6rem] border border-white/10 bg-black/25 p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sky-300">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div className="text-sm uppercase tracking-[0.18em] text-zinc-500">Launch Route</div>
                  <div className="mt-2 text-lg font-semibold text-white">{previewUrl ? 'Live site available' : 'Internal showcase'}</div>
                </article>

                <article className="rounded-[1.6rem] border border-white/10 bg-black/25 p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sky-300">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <div className="text-sm uppercase tracking-[0.18em] text-zinc-500">CTA</div>
                  <div className="mt-2 text-lg font-semibold text-white">{product.ctaText || `Explore ${product.title}`}</div>
                </article>
              </div>
            </div>
          </section>

          {featureTitles.length ? (
            <section className="rounded-[2rem] border border-white/10 bg-black/20 p-6 md:p-8">
              <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-500">Core Capabilities</div>
                  <h2 className="font-serif-custom text-3xl text-white md:text-5xl">What powers {product.title}</h2>
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
                  Every detail below is being pulled from the product record, so this page now stays in sync with the actual product content instead of using old static UI blocks.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
            <section className="rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,23,35,0.92)_0%,rgba(7,10,18,0.96)_100%)] p-8 text-center md:p-12">
              <div className="mx-auto max-w-3xl">
                <div className="mb-4 text-xs uppercase tracking-[0.24em] text-zinc-500">Next Step</div>
                <h2 className="font-serif-custom text-4xl text-white md:text-6xl">Take {product.title} further</h2>
                <p className="mt-5 text-base leading-relaxed text-zinc-400 md:text-lg">
                  Open the live experience, continue to the product CTA, or explore the app store destinations attached to this product.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {previewUrl ? (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
                  >
                    Open live site
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : product.showCta !== false ? (
                  <button
                    type="button"
                    onClick={openPrimaryAction}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
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
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    App Store
                  </a>
                ) : null}

                {product.playStoreLink ? (
                  <a
                    href={product.playStoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/[0.06]"
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
