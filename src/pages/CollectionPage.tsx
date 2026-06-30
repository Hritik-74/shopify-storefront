import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchCollection } from '@/api/shopify'
import type { Collection, Product } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import Reveal from '@/components/ui/Reveal'

export default function CollectionPage() {
  const { handle = '' } = useParams()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    fetchCollection(handle)
      .then((result) => {
        if (cancelled) return
        if (!result) {
          setNotFound(true)
          return
        }
        setCollection(result.collection)
        setProducts(result.products)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [handle])

  if (loading) return <p className="container-x py-20 text-ink-soft">Loading collection…</p>
  if (error) return <p className="container-x py-20 text-sm text-red-600">Error: {error}</p>
  if (notFound)
    return (
      <div className="container-x py-20">
        <p className="text-ink-soft">Collection not found.</p>
        <Link to="/collections" className="label mt-3 inline-block hover:underline">
          ← Back to collections
        </Link>
      </div>
    )

  return (
    <>
      <section
        className="relative bg-ink bg-cover bg-center"
        style={
          collection?.image ? { backgroundImage: `url(${collection.image.url})` } : undefined
        }
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="container-x relative z-10 py-20 text-white">
          <nav className="label text-white/70">
            <Link to="/collections" className="hover:underline">
              Collections
            </Link>{' '}
            / {collection?.title}
          </nav>
          <h1 className="display mt-3 text-5xl sm:text-7xl">{collection?.title}</h1>
          {collection?.description && (
            <p className="mt-4 max-w-2xl text-white/85">{collection.description}</p>
          )}
          <span className="label mt-5 inline-block text-white/70">
            {products.length} products
          </span>
        </div>
      </section>

      <div className="container-x py-16">
        {products.length === 0 ? (
          <p className="text-ink-soft">No products in this collection yet.</p>
        ) : (
          <Reveal
            stagger
            className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
          >
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Reveal>
        )}
      </div>
    </>
  )
}
