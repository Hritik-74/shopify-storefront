import { useEffect, useRef, type ReactNode } from 'react'
import Flickity from 'flickity'

interface CarouselProps {
  children: ReactNode
  options?: Flickity.Options
  className?: string
}

/**
 * Thin React wrapper around Flickity. Re-initialises when the number of
 * children changes (e.g. once async products have loaded).
 */
export default function Carousel({ children, options, className }: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null)
  const flkty = useRef<Flickity | null>(null)
  const childCount = Array.isArray(children) ? children.length : 1

  useEffect(() => {
    if (!ref.current) return
    flkty.current = new Flickity(ref.current, {
      cellAlign: 'left',
      contain: true,
      pageDots: false,
      prevNextButtons: true,
      groupCells: true,
      ...options,
    })
    return () => {
      flkty.current?.destroy()
      flkty.current = null
    }
    // Re-init when child count changes so async-loaded cells are measured.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childCount])

  return (
    <div ref={ref} className={`carousel ${className ?? ''}`}>
      {children}
    </div>
  )
}
