import { useCart } from '../context/CartContext'
import type { Money } from '../lib/types'

function formatPrice(price: Money | null): string {
  if (!price) return ''
  const amount = Number(price.amount).toFixed(2)
  return `${amount} ${price.currencyCode}`
}

export default function Cart() {
  const { cart, totalQuantity, loading, error } = useCart()

  const lines = cart?.lines?.edges ?? []

  function handleCheckout() {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl
    }
  }

  return (
    <aside className="cart">
      <h2>
        Cart {totalQuantity > 0 && <span className="badge">{totalQuantity}</span>}
      </h2>

      {error && <p className="status error">Error: {error}</p>}

      {lines.length === 0 ? (
        <p className="status">Your cart is empty.</p>
      ) : (
        <ul className="cart-lines">
          {lines.map(({ node }) => {
            const variant = node.merchandise
            return (
              <li key={node.id} className="cart-line">
                {variant.image && (
                  <img
                    className="cart-line-image"
                    src={variant.image.url}
                    alt={variant.image.altText || variant.product.title}
                  />
                )}
                <div className="cart-line-info">
                  <span className="cart-line-title">{variant.product.title}</span>
                  {variant.title !== 'Default Title' && (
                    <span className="cart-line-variant">{variant.title}</span>
                  )}
                  <span className="cart-line-qty">Qty: {node.quantity}</span>
                </div>
                <span className="cart-line-price">{formatPrice(variant.price)}</span>
              </li>
            )
          })}
        </ul>
      )}

      {cart?.cost?.totalAmount && (
        <div className="cart-total">
          <span>Total</span>
          <strong>{formatPrice(cart.cost.totalAmount)}</strong>
        </div>
      )}

      <button
        className="btn btn-checkout"
        disabled={loading || lines.length === 0}
        onClick={handleCheckout}
      >
        Checkout
      </button>
    </aside>
  )
}
