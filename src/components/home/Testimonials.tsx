import Carousel from '@/components/ui/Carousel'
import { TESTIMONIALS } from '@/config/brand'

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <Carousel options={{ groupCells: true, cellAlign: 'left', contain: true }}>
      {TESTIMONIALS.map((t) => (
        <div key={t.name} className="mr-4 w-[85%] sm:w-[45%] lg:w-[31%]">
          <div className="card h-full p-6">
            <Stars />
            <p className="mt-3 text-[15px] leading-relaxed text-ink">“{t.text}”</p>
            <p className="mt-4 text-sm font-semibold">{t.name}</p>
            <p className="text-xs text-ink-soft">Verified buyer</p>
          </div>
        </div>
      ))}
    </Carousel>
  )
}
