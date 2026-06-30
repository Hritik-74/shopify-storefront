import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/format'

export default function CartDrawer() {
  const { cart, totalQuantity, loading, error, isOpen, closeCart } = useCart()

  const lines = cart?.lines?.edges ?? []

  // Send the shopper to the Shopify online-store cart via a cart permalink.
  // The GoKwik app (installed from the Shopify App Store) injects its script there and
  // replaces checkout with GoKwik's one-click checkout.
  //
  // Permalink format: https://{domain}/cart/{numericVariantId}:{qty},{...}
  // Storefront variant ids are GIDs (gid://shopify/ProductVariant/123) — we take the numeric part.
  function handleCheckout() {
    if (!cart || lines.length === 0) return

    const domain = import.meta.env.VITE_SHOPIFY_DOMAIN
    const items = lines
      .map(({ node }) => {
        const numericVariantId = node.merchandise.id.split('/').pop()
        return `${numericVariantId}:${node.quantity}`
      })
      .join(',')

    window.location.href = `https://${domain}/cart/${items}`
  }

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 bg-black/45 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-full w-[400px] max-w-[90vw] flex-col bg-paper shadow-[-10px_0_40px_rgba(0,0,0,0.15)] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="display flex items-center gap-2 text-xl">
            Your cart
            {totalQuantity > 0 && (
              <span className="rounded-full bg-ink px-2 py-0.5 font-sans text-xs font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-3xl leading-none text-ink-soft transition-colors hover:text-ink"
          >
            ×
          </button>
        </div>

        {error && <p className="px-6 py-4 text-sm text-red-600">Error: {error}</p>}

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center text-ink-soft">
            <p>Your cart is empty.</p>
            <Link to="/shop" className="btn" onClick={closeCart}>
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto px-6">
            {lines.map(({ node }) => {
              const variant = node.merchandise
              return (
                <li
                  key={node.id}
                  className="flex items-center gap-4 border-b border-line py-4"
                >
                  {variant.image && (
                    <img
                      src={variant.image.url}
                      alt={variant.image.altText || variant.product.title}
                      className="h-[72px] w-[60px] flex-none object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col gap-0.5 text-sm">
                    <span className="font-semibold">{variant.product.title}</span>
                    {variant.title !== 'Default Title' && (
                      <span className="text-xs text-ink-soft">{variant.title}</span>
                    )}
                    <span className="text-xs text-ink-soft">Qty: {node.quantity}</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(variant.price)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}

        {lines.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            {cart?.cost?.totalAmount && (
              <div className="mb-1 flex justify-between text-base">
                <span>Subtotal</span>
                <strong>{formatPrice(cart.cost.totalAmount)}</strong>
              </div>
            )}
            <p className="mb-4 text-xs text-ink-soft">
              Shipping &amp; taxes calculated at checkout.
            </p>
            <button
              className="btn btn-accent w-full"
              disabled={loading || lines.length === 0}
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
