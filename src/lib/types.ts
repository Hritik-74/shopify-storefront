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
  variantId: string | null
  availableForSale: boolean
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
