import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealProps {
  children: ReactNode
  /** Animate direct children with a stagger instead of the wrapper itself. */
  stagger?: boolean
  /** Initial vertical offset in px. */
  y?: number
  delay?: number
  className?: string
}

export default function Reveal({
  children,
  stagger = false,
  y = 28,
  delay = 0,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.8,
        ease: 'power3.out',
        delay,
        stagger: stagger ? 0.08 : 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
        },
      })
    }, el)

    return () => ctx.revert()
  }, [stagger, y, delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
