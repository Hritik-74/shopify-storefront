import { TRUST } from '@/config/brand'

const ICONS: Record<string, JSX.Element> = {
  truck: (
    <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 17a2 2 0 104 0M16 17a2 2 0 104 0" />
  ),
  return: <path d="M4 9a8 8 0 1114 5M4 9V4M4 9h5" />,
  lock: <path d="M6 11h12v9H6zM9 11V8a3 3 0 016 0v3" />,
  support: <path d="M5 13a7 7 0 0114 0M4 13h3v5H4zM17 13h3v5h-3zM12 18v2a3 3 0 003-3" />,
}

export default function TrustBadges() {
  return (
    <section className="border-y border-line bg-paper">
      <div className="container-x grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
        {TRUST.map((b) => (
          <div key={b.title} className="flex flex-col items-center gap-2 text-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-9 w-9 flex-none text-accent"
            >
              {ICONS[b.icon]}
            </svg>
            <p className="text-sm font-semibold">{b.title}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
