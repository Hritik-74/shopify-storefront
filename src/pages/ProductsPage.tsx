import { useEffect, useState } from 'react'
import { fetchProducts } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import type { Money, Product } from '../lib/types'

function formatPrice(price: Money | null): string {
  if (!price) return ''
  const amount = Number(price.amount).toFixed(2)
  return `${amount} ${price.currencyCode}`
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart, loading: cartLoading } = useCart()

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

  if (loading) return <p className="status">Loading products…</p>
  if (error) return <p className="status error">Error: {error}</p>
  if (products.length === 0) return <p className="status">No products found.</p>

  return (
    <div className="products-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          {product.image ? (
            <img
              className="product-image"
              src={product.image.url}
              alt={product.image.altText || product.title}
            />
          ) : (
            <div className="product-image placeholder">No image</div>
          )}
          <h3 className="product-title">{product.title}</h3>
          <p className="product-price">{formatPrice(product.price)}</p>
          <button
            className="btn"
            disabled={!product.availableForSale || !product.variantId || cartLoading}
            onClick={() => product.variantId && addToCart(product.variantId)}
          >
            {product.availableForSale ? 'Add to Cart' : 'Sold out'}
          </button>
        </div>
      ))}
    </div>
  )
}
