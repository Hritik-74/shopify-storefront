import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createCart, addToCart as apiAddToCart, getCart } from '../lib/shopify'

const CartContext = createContext(null)

const STORAGE_KEY = 'shopify_cart_id'

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // On mount, restore an existing cart from localStorage or create a new one.
  useEffect(() => {
    let cancelled = false

    async function initCart() {
      setLoading(true)
      try {
        const savedId = localStorage.getItem(STORAGE_KEY)
        let activeCart = null

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
        if (!cancelled) setError(err.message)
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
    async (variantId, quantity = 1) => {
      if (!cart) return
      setLoading(true)
      setError(null)
      try {
        const updated = await apiAddToCart(cart.id, variantId, quantity)
        setCart(updated)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [cart]
  )

  const totalQuantity = cart?.totalQuantity ?? 0

  const value = {
    cart,
    loading,
    error,
    addToCart,
    totalQuantity,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
