import { useEffect, useState } from 'react'
import { fetchCollections } from '@/api/shopify'
import type { Collection } from '@/types'
import CollectionCard from '@/components/collection/CollectionCard'
import Reveal from '@/components/ui/Reveal'

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchCollections()
      .then((data) => {
        if (!cancelled) setCollections(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="container-x py-16">
      <header className="mb-10">
        <p className="label text-ink-soft">Browse</p>
        <h1 className="display mt-2 text-5xl sm:text-6xl">Categories</h1>
        <p className="mt-3 text-ink-soft">Explore the full range, organised by category.</p>
      </header>

      {loading && <p className="py-6 text-ink-soft">Loading collections…</p>}
      {error && <p className="py-6 text-sm text-red-600">Error: {error}</p>}
      {!loading && !error && collections.length === 0 && (
        <p className="py-6 text-ink-soft">No collections found.</p>
      )}

      <Reveal stagger className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {collections.map((c) => (
          <CollectionCard key={c.id} collection={c} />
        ))}
      </Reveal>
    </div>
  )
}
