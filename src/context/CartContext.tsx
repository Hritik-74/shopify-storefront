import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { createCart, addToCart as apiAddToCart, getCart } from '../lib/shopify'
import type { Cart } from '../lib/types'

interface CartContextValue {
  cart: Cart | null
  loading: boolean
  error: string | null
  addToCart: (variantId: string, quantity?: number) => Promise<void>
  totalQuantity: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'shopify_cart_id'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // On mount, restore an existing cart from localStorage or create a new one.
  useEffect(() => {
    let cancelled = false

    async function initCart() {
      setLoading(true)
      try {
        const savedId = localStorage.getItem(STORAGE_KEY)
        let activeCart: Cart | null = null

        if (savedId) {
          activeCart = await getCart(savedId)
        }

        // If there was no saved cart, or Shopify returned null (expired/checked out), make a fresh one.
        if (!activeCart) {
          activeCart = await createCart()
          localStorage.setItem(STORAGE_KEY, activeCart.id)
        }

        if (!cancelled) setCart(activeCart)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    initCart()
    return () => {
      cancelled = true
    }
  }, [])

  const addToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      if (!cart) return
      setLoading(true)
      setError(null)
      try {
        const updated = await apiAddToCart(cart.id, variantId, quantity)
        setCart(updated)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    },
    [cart]
  )

  const totalQuantity = cart?.totalQuantity ?? 0

  const value: CartContextValue = {
    cart,
    loading,
    error,
    addToCart,
    totalQuantity,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
