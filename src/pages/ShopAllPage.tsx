import { useEffect, useState } from 'react'
import { fetchProducts } from '@/api/shopify'
import type { Product } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import Reveal from '@/components/ui/Reveal'

export default function ShopAllPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchProducts()
      .then((data) => {
        if (!cancelled) setProducts(data)
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
  }, [])

  return (
    <div className="container-x py-16">
      <header className="mb-10">
        <p className="label text-ink-soft">{products.length || ''} products</p>
        <h1 className="display mt-2 text-5xl sm:text-6xl">Shop all</h1>
        <p className="mt-3 text-ink-soft">Every device, all in one place.</p>
      </header>

      {loading && <p className="py-6 text-ink-soft">Loading products…</p>}
      {error && <p className="py-6 text-sm text-red-600">Error: {error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="py-6 text-ink-soft">No products found.</p>
      )}

      <Reveal stagger className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </Reveal>
    </div>
  )
}
