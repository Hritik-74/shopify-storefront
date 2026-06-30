interface MarqueeProps {
  items: string[]
  className?: string
}

/** Infinite scrolling strip. Items are duplicated so the loop is seamless. */
export default function Marquee({ items, className }: MarqueeProps) {
  const row = [...items, ...items]
  return (
    <div className={`overflow-hidden ${className ?? ''}`}>
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="display flex items-center text-xl">
            {item}
            <span className="mx-6 text-sm opacity-40">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}
