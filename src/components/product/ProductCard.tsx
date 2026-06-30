import { formatPrice } from '@/utils/format'
import type { Product } from '@/types'

export default function ProductCard({ product }: { product: Product }) {
  const soldOut = !product.availableForSale || !product.variantId

  const discount =
    product.compareAtPrice && Number(product.compareAtPrice.amount) > 0
      ? Math.round(
          (1 - Number(product.price.amount) / Number(product.compareAtPrice.amount)) * 100
        )
      : 0

  // "Buy Now" → straight to checkout via a single-item Shopify cart permalink
  // (where the GoKwik one-click checkout takes over).
  function buyNow() {
    if (!product.variantId) return
    const domain = import.meta.env.VITE_SHOPIFY_DOMAIN
    const numericVariantId = product.variantId.split('/').pop()
    window.location.href = `https://${domain}/cart/${numericVariantId}:1`
  }

  return (
    <article className="card group flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-cream">
        {product.image ? (
          <img
            src={product.image.url}
            alt={product.image.altText || product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-ink-soft">
            No image
          </div>
        )}

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-accent px-2 py-1 text-xs font-bold text-white">
            Sale
          </span>
        )}
        {soldOut && (
          <span className="absolute right-3 top-3 rounded-md bg-ink/80 px-2 py-1 text-[11px] font-semibold text-white">
            Sold out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium">{product.title}</h3>

        <div className="mt-1 flex items-center gap-1 text-xs text-ink-soft">
          <span className="text-amber-400">★★★★★</span>
          <span>4.0</span>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          {product.compareAtPrice && (
            <span className="text-sm text-ink-soft line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span className="text-base font-bold text-accent">
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          disabled={soldOut}
          onClick={buyNow}
          className="btn mt-4 w-full"
        >
          {soldOut ? 'Sold out' : 'Buy Now'}
        </button>
      </div>
    </article>
  )
}
