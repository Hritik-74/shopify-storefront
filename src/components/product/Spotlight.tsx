import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProductByHandle } from '@/api/shopify'
import { formatPrice } from '@/utils/format'
import { useCart } from '@/context/CartContext'
import type { ProductDetail } from '@/types'

export default function Spotlight({
  handle,
  fallbackHandle,
}: {
  handle: string
  fallbackHandle?: string
}) {
  const { addToCart, loading } = useCart()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    let cancelled = false
    fetchProductByHandle(handle)
      .then((p) => {
        if (cancelled) return
        // The store's featured product may have changed — fall back to a live one.
        if (!p && fallbackHandle) return fetchProductByHandle(fallbackHandle)
        setProduct(p)
        return undefined
      })
      .then((p) => {
        if (p && !cancelled) setProduct(p)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [handle, fallbackHandle])

  if (!product) return null

  const soldOut = !product.availableForSale || !product.variantId
  const images = product.images.length ? product.images : product.image ? [product.image] : []
  const mainImage = images[active] ?? images[0]

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2">
      {/* Gallery */}
      <div>
        <div className="aspect-square overflow-hidden rounded-2xl border border-line bg-cream">
          {mainImage && (
            <img
              src={mainImage.url}
              alt={mainImage.altText || product.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-3">
            {images.slice(0, 5).map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                  i === active ? 'border-accent' : 'border-line'
                }`}
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <div className="flex gap-0.5 text-amber-400">★★★★★</div>
        <h2 className="display mt-2 text-2xl sm:text-3xl">{product.title}</h2>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-2xl font-bold text-accent">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-lg text-ink-soft line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {product.description && (
          <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-ink-soft">
            {product.description}
          </p>
        )}

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center rounded-lg border border-line">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-4 py-2.5 text-lg"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-semibold">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="px-4 py-2.5 text-lg"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            disabled={soldOut || loading}
            onClick={() => product.variantId && addToCart(product.variantId, qty)}
            className="btn flex-1"
          >
            {soldOut ? 'Sold out' : 'Add to cart'}
          </button>
        </div>

        <Link
          to={`/collections`}
          className="btn btn-dark mt-3 w-full"
        >
          View full details
        </Link>
      </div>
    </div>
  )
}
