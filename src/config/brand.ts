// Central place for brand copy + the real assets from the live My Store 2 storefront.
export const BRAND = 'My Store'
export const ANNOUNCEMENT = 'Enjoy Free Home Delivery'

const CDN = 'https://nnvxsq-q0.myshopify.com/cdn/shop'

// Header logo (actual logo image used on the live store).
export const LOGO = `${CDN}/files/ChatGPT_Image_Jun_29_2026_03_10_29_PM.png?v=1782726065&width=400`

// Exact top navigation menu (order matches the live store).
export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'electronics', href: '/collections/electronics' },
  { label: 'Fashion & Beauty', href: '/collections/fashion-beauty' },
  { label: 'Fitness', href: '/collections/fitness' },
  { label: 'Kids Toys', href: '/collections/kids-toys' },
  { label: 'Kitchen', href: '/collections/kitchen' },
  { label: 'Home accessories', href: '/collections/home-accessories' },
]

// Hero slideshow banners (the real full-width banner images).
export const HERO_BANNERS = [
  {
    src: `${CDN}/files/Jun_29_2026_02_09_15_PM.png?v=1782722529&width=1800`,
    href: '/shop',
    alt: 'Shop the latest deals',
  },
  {
    src: `${CDN}/files/ChatGPT_Image_Jun_29_2026_01_31_22_PM.png?v=1782722432&width=1800`,
    href: '/collections',
    alt: 'Browse our categories',
  },
]

// Circular category tiles (image + label, in the live store's order).
export const CIRCLE_CATEGORIES = [
  { label: 'electronics', href: '/collections/electronics', img: `${CDN}/files/headpones.avif?v=1782716605&width=300` },
  { label: 'Fitness', href: '/collections/fitness', img: `${CDN}/files/6603d31668466740590fc6c2_1730883093005.jpg?v=1782386244&width=300` },
  { label: 'Kitchen', href: '/collections/kitchen', img: `${CDN}/files/shopping_57.webp?v=1782384200&width=300` },
  { label: 'Kids Toys', href: '/collections/kids-toys', img: `${CDN}/files/musical-dancing-robot-white-3-magic-moments-original-imaheht2hje7hfgf.webp?v=1782382454&width=300` },
  { label: 'Home accessories', href: '/collections/home-accessories', img: `${CDN}/files/shopping_40_c9a1dd38-de2f-494e-9e7b-45391cd397f2.webp?v=1782384620&width=300` },
  { label: 'Fashion & Beauty', href: '/collections/fashion-beauty', img: `${CDN}/files/shopping_78_46cb7f48-111b-47c5-8912-f8508f7db7fe.webp?v=1782385950&width=300` },
]

// Full-width promotional image banner (between products and the featured product).
export const IMAGE_BANNER = `${CDN}/files/ChatGPT_Image_Jun_29_2026_03_17_43_PM.png?v=1782726588&width=1800`

// "Trusted by Happy Customers" video reels.
export const VIDEOS = [
  {
    src: `${CDN}/videos/c/vp/db40b518ad0d47bfadfbf80e00e569a3/db40b518ad0d47bfadfbf80e00e569a3.SD-480p-0.9Mbps-87650146.mp4`,
    poster: `${CDN}/files/preview_images/db40b518ad0d47bfadfbf80e00e569a3.thumbnail.0000000000_1080x.jpg?v=1782719518`,
  },
  {
    src: `${CDN}/videos/c/vp/92ceb62f530849a5a3e13258148ad2f2/92ceb62f530849a5a3e13258148ad2f2.SD-480p-0.9Mbps-87650142.mp4`,
    poster: `${CDN}/files/preview_images/92ceb62f530849a5a3e13258148ad2f2.thumbnail.0000000000_1080x.jpg?v=1782719511`,
  },
]

export const VIDEO_HEADING = 'Trusted by Happy Customers'
export const VIDEO_TAGLINE =
  'Quality products. Fast delivery. Secure checkout. Exceptional support — everything you need for a great shopping experience.'

// The product the live store spotlights on its homepage.
export const FEATURED_HANDLE =
  'pawells-premium-gym-accessories-combo-for-man-and-woman-gym-kit-for-home-workout-with-gym-bag-shaker-rope-wrist-band-towel-gloves-deadlift'

// Trust badges (labels only — as on the live store).
export const TRUST = [
  { icon: 'truck', title: 'Free Shipping' },
  { icon: 'return', title: '7 Days Easy Return' },
  { icon: 'lock', title: '100% Secure Payment' },
  { icon: 'support', title: '24/7 Customer Support' },
]

// Text testimonials ("What Our Customers Say").
export const TESTIMONIALS = [
  { name: 'James Anderson', text: 'Best quality products!' },
  { name: 'Sophie Martinez', text: 'On time delivery and excellent customer service!' },
  { name: 'Oliver Thompson', text: 'Amazing quality! Highly recommend to everyone.' },
  { name: 'Emma Williams', text: 'Fast delivery and great packaging. Very happy!' },
  { name: 'Lucas Rodriguez', text: 'Excellent products with top-notch quality!' },
  { name: 'Isabella Chen', text: 'Very reliable service. Will order again!' },
  { name: 'Noah Johnson', text: 'Perfect quality and timely delivery. Loved it!' },
  { name: 'Mia Kowalski', text: 'Outstanding service and product quality!' },
]

// Newsletter.
export const NEWSLETTER_HEADING = "Subscribe to getting Offer's"
export const NEWSLETTER_TEXT =
  'Be the first to know about new collections and exclusive offers.'

// Footer "Our Promised".
export const PROMISE_HEADING = 'Our Promised'
export const PROMISE_TEXT =
  'We’re here for you with secure checkout, reliable delivery all over India, and friendly support at every step. Your satisfaction and trust mean the world to us, and we’re dedicated to making your shopping journey effortless and rewarding.'
