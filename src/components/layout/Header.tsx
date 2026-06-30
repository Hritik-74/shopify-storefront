import { NavLink, Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { BRAND, LOGO, NAV } from '@/config/brand'

export default function Header() {
  const { totalQuantity, openCart } = useCart()

  return (
    <header className="sticky top-0 z-30 bg-paper shadow-sm">
      {/* Row 1: logo / search / login + cart */}
      <div className="container-x flex items-center gap-6 py-4">
        <Link to="/" className="flex-none">
          <img src={LOGO} alt={BRAND} className="h-11 w-auto object-contain" />
        </Link>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="ml-auto hidden flex-1 items-center md:flex md:max-w-md"
        >
          <input
            type="search"
            placeholder="Search for products…"
            className="w-full rounded-l-lg border border-line bg-cream px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
          />
          <button
            className="rounded-r-lg border border-l-0 border-accent bg-accent px-4 py-2.5 text-white"
            aria-label="Search"
          >
            🔍
          </button>
        </form>

        <div className="ml-auto flex items-center gap-5 md:ml-0">
          <a href="#" className="hidden text-sm font-medium text-ink-soft hover:text-ink sm:block">
            Log in
          </a>
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative flex items-center gap-2 text-sm font-semibold"
          >
            <span className="text-xl">🛒</span>
            <span className="hidden sm:block">Cart</span>
            {totalQuantity > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Row 2: category navigation (exact menu order) */}
      <nav className="border-t border-line bg-paper">
        <div className="container-x flex gap-7 overflow-x-auto py-3 text-sm font-medium [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((l) => (
            <NavLink
              key={l.href}
              to={l.href}
              end={l.href === '/'}
              className={({ isActive }) =>
                `whitespace-nowrap transition-colors ${
                  isActive ? 'text-accent' : 'text-ink hover:text-accent'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
