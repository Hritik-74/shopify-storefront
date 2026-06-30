import { Link } from 'react-router-dom'
import {
  BRAND,
  NAV,
  NEWSLETTER_HEADING,
  NEWSLETTER_TEXT,
  PROMISE_HEADING,
  PROMISE_TEXT,
} from '@/config/brand'

export default function Footer() {
  return (
    <footer className="mt-8 bg-ink text-neutral-300">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="container-x flex flex-col items-center gap-5 py-12 text-center">
          <h2 className="display text-2xl text-white sm:text-3xl">{NEWSLETTER_HEADING}</h2>
          <p className="max-w-md text-sm">{NEWSLETTER_TEXT}</p>
          <form className="flex w-full max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              placeholder="Email"
              className="flex-1 border border-white/25 bg-transparent px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
            />
            <button className="btn">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="container-x grid grid-cols-1 gap-8 py-12 sm:grid-cols-3">
        <div>
          <h4 className="label mb-3 text-white">{PROMISE_HEADING}</h4>
          <p className="max-w-sm text-sm leading-relaxed">{PROMISE_TEXT}</p>
        </div>

        <div>
          <h4 className="label mb-4 text-white">Quick links</h4>
          <div className="flex flex-col gap-2 text-sm">
            <a href="#" className="hover:text-white">Search</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
          </div>
        </div>

        <div>
          <h4 className="label mb-4 text-white">Buy {BRAND}</h4>
          <div className="flex flex-col gap-2 text-sm">
            {NAV.map((l) => (
              <Link key={l.href} to={l.href} className="hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-x flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} {BRAND}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {['VISA', 'Mastercard', 'RuPay', 'UPI', 'Paytm'].map((p) => (
              <span
                key={p}
                className="rounded bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-neutral-200"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
