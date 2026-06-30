import { Routes, Route } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import HomePage from '@/pages/HomePage'
import ShopAllPage from '@/pages/ShopAllPage'
import CollectionsPage from '@/pages/CollectionsPage'
import CollectionPage from '@/pages/CollectionPage'
import { ANNOUNCEMENT } from '@/config/brand'

export default function App() {
  return (
    <CartProvider>
      <div className="bg-accent py-2.5 text-center text-xs font-medium text-white">
        {ANNOUNCEMENT}
      </div>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopAllPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:handle" element={<CollectionPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  )
}
