// Shared domain types for the Shopify Storefront data.

export interface Money {
  amount: string
  currencyCode: string
}

export interface ShopifyImage {
  url: string
  altText: string | null
}

export interface Product {
  id: string
  title: string
  description: string
  handle: string
  image: ShopifyImage | null
  price: Money
  /** Original price when the item is on sale (higher than `price`), else null. */
  compareAtPrice: Money | null
  variantId: string | null
  availableForSale: boolean
}

export interface ProductDetail extends Product {
  images: ShopifyImage[]
}

export interface Collection {
  id: string
  title: string
  handle: string
  description: string
  image: ShopifyImage | null
  productCount: number
}

export interface CartLineMerchandise {
  id: string
  title: string
  price: Money
  image: ShopifyImage | null
  product: { title: string }
}

export interface CartLine {
  id: string
  quantity: number
  merchandise: CartLineMerchandise
}

export interface Cart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: Money
    totalAmount: Money
  }
  lines: {
    edges: { node: CartLine }[]
  }
}
