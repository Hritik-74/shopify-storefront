import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '@/api/shopify'
import { HERO_BANNERS, IMAGE_BANNER, FEATURED_HANDLE } from '@/config/brand'
import type { Product } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import Carousel from '@/components/ui/Carousel'
import Marquee from '@/components/ui/Marquee'
import CircleCategories from '@/components/collection/CircleCategories'
import VideoReviews from '@/components/home/VideoReviews'
import TrustBadges from '@/components/home/TrustBadges'
import Testimonials from '@/components/home/Testimonials'
import Spotlight from '@/components/product/Spotlight'
import FAQ from '@/components/home/FAQ'

const WELCOME = Array(8).fill('Welcome to our store')

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchProducts(12)
      .then((prods) => !cancelled && setProducts(prods))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : String(err)))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      {/* 1. Hero slideshow */}
      <section className="relative">
        <Carousel
          options={{
            wrapAround: true,
            autoPlay: 5000,
            adaptiveHeight: true,
            pageDots: true,
            prevNextButtons: false,
            groupCells: false,
            contain: false,
          }}
        >
          {HERO_BANNERS.map((b, i) => (
            <Link key={i} to={b.href} className="block w-full">
              <img src={b.src} alt={b.alt} className="h-auto w-full" />
            </Link>
          ))}
        </Carousel>
      </section>

      {/* 2. Circular category tiles */}
      <CircleCategories />

      {/* 3. Welcome marquee */}
      <div className="bg-ink py-4 text-white">
        <Marquee items={WELCOME} />
      </div>

      {error && <p className="container-x py-6 text-sm text-red-600">Error: {error}</p>}

      {/* 4. Featured products */}
      <section className="container-x py-12">
        {products.length === 0 ? (
          <SkeletonRow />
        ) : (
          <Carousel options={{ groupCells: true, cellAlign: 'left', contain: true }}>
            {products.map((p) => (
              <div key={p.id} className="mr-4 w-[60%] sm:w-[45%] md:w-[31%] lg:w-[23.5%]">
                <ProductCard product={p} />
              </div>
            ))}
          </Carousel>
        )}
      </section>

      {/* 5. Image banner */}
      <section className="w-full">
        <img src={IMAGE_BANNER} alt="" className="h-auto w-full" />
      </section>

      {/* 6. Featured product spotlight (Pawells) */}
      <section className="container-x py-14">
        <Spotlight handle={FEATURED_HANDLE} fallbackHandle={products[0]?.handle} />
      </section>

      {/* 7. Video reviews — "Trusted by Happy Customers" */}
      <VideoReviews />

      {/* 8. Text testimonials — "What Our Customers Say" */}
      <section className="container-x py-14">
        <h2 className="display mb-8 text-center text-3xl sm:text-4xl">What Our Customers Say</h2>
        <Testimonials />
      </section>

      {/* 9. Trust badges */}
      <TrustBadges />

      {/* 10. FAQ */}
      <section id="faq" className="container-x py-16">
        <h2 className="display mb-8 text-center text-3xl sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <FAQ />
        <div className="mt-10 text-center">
          <h3 className="text-lg font-semibold">Need More Help?</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Our Customer support team is here to assist you 24/7
          </p>
          <a href="#" className="btn mt-4">
            Contact Us
          </a>
        </div>
      </section>
    </>
  )
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="aspect-square animate-pulse rounded-2xl bg-cream" />
      ))}
    </div>
  )
}
