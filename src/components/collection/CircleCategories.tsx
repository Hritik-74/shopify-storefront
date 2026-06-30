import { Link } from 'react-router-dom'
import { CIRCLE_CATEGORIES } from '@/config/brand'

export default function CircleCategories() {
  return (
    <div className="container-x py-8">
      <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
        {CIRCLE_CATEGORIES.map((c) => (
          <Link key={c.label} to={c.href} className="group flex w-24 flex-col items-center gap-2 sm:w-28">
            <span className="block aspect-square w-full overflow-hidden rounded-full border-2 border-line bg-cream transition group-hover:border-accent">
              <img
                src={c.img}
                alt={c.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </span>
            <span className="text-center text-xs font-medium capitalize">{c.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
