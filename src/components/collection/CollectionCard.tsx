import { Link } from 'react-router-dom'
import type { Collection } from '@/types'

export default function CollectionCard({
  collection,
}: {
  collection: Collection
}) {
  return (
    <Link to={`/collections/${collection.handle}`} className="card group block">
      <div className="aspect-[4/3] overflow-hidden bg-cream">
        {collection.image ? (
          <img
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-soft">
            {collection.title}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div>
          <h3 className="font-display text-lg font-bold tracking-[-0.01em]">
            {collection.title}
          </h3>
          <p className="label mt-1 text-ink-soft transition-colors group-hover:text-accent">
            Shop now
          </p>
        </div>
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-cream text-ink transition-colors group-hover:bg-accent group-hover:text-white">
          →
        </span>
      </div>
    </Link>
  )
}
