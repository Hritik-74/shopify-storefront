import { CartProvider, useCart } from './context/CartContext'
import ProductsPage from './pages/ProductsPage'
import Cart from './components/Cart'

function Header() {
  const { totalQuantity } = useCart()
  return (
    <header className="header">
      <h1>Storefront</h1>
      <span className="cart-count">🛒 {totalQuantity}</span>
    </header>
  )
}

export default function App() {
  return (
    <CartProvider>
      <Header />
      <main className="layout">
        <ProductsPage />
        <Cart />
      </main>
    </CartProvider>
  )
}
