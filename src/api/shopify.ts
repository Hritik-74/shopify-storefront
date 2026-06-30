// Shopify Storefront API client.
// Talks to the GraphQL Storefront API using a public storefront access token.

import type { Cart, Collection, Product, ProductDetail } from '@/types'

const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
const API_VERSION = '2024-10'

const ENDPOINT = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`

interface GraphQLResponse<T> {
  data: T
  errors?: { message: string }[]
}

interface UserError {
  field: string[] | null
  message: string
}

/**
 * Low-level helper: POST a GraphQL query/mutation and return `data`.
 * Throws on network errors or GraphQL `errors`.
 */
async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (!DOMAIN || !TOKEN) {
    throw new Error(
      'Missing Shopify config. Set VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN in your .env file.'
    )
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new Error(`Shopify request failed: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as GraphQLResponse<T>

  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join('; '))
  }

  return json.data
}

// Shared product fields used by the products query and collection-product queries.
const PRODUCT_FIELDS = `
  id
  title
  description
  handle
  featuredImage { url altText }
  priceRange {
    minVariantPrice { amount currencyCode }
  }
  compareAtPriceRange {
    minVariantPrice { amount currencyCode }
  }
  variants(first: 1) {
    edges {
      node {
        id
        availableForSale
      }
    }
  }
`

interface Money {
  amount: string
  currencyCode: string
}

interface ProductNode {
  id: string
  title: string
  description: string
  handle: string
  featuredImage: { url: string; altText: string | null } | null
  priceRange: { minVariantPrice: Money }
  compareAtPriceRange?: { minVariantPrice: Money } | null
  variants: { edges: { node: { id: string; availableForSale: boolean } }[] }
}

function mapProduct(node: ProductNode): Product {
  const variant = node.variants.edges[0]?.node
  const price = node.priceRange.minVariantPrice
  const compareAt = node.compareAtPriceRange?.minVariantPrice
  // Shopify returns 0.0 (or equal) when there's no real compare-at price.
  const onSale = compareAt && Number(compareAt.amount) > Number(price.amount)
  return {
    id: node.id,
    title: node.title,
    description: node.description,
    handle: node.handle,
    image: node.featuredImage,
    price,
    compareAtPrice: onSale ? compareAt : null,
    variantId: variant?.id ?? null,
    availableForSale: variant?.availableForSale ?? false,
  }
}

// Shared cart fields so create / add / fetch all return the same shape.
const CART_FRAGMENT = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            image { url altText }
            product { title }
          }
        }
      }
    }
  }
`

interface ProductsQuery {
  products: { edges: { node: ProductNode }[] }
}

/**
 * Fetch all products (first `limit`) with their first variant and image.
 */
export async function fetchProducts(limit = 100): Promise<Product[]> {
  const query = `
    query Products($limit: Int!) {
      products(first: $limit, sortKey: CREATED_AT, reverse: true) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }
  `

  const data = await shopifyFetch<ProductsQuery>(query, { limit })
  return data.products.edges.map(({ node }) => mapProduct(node))
}

/**
 * Fetch a single product by handle, including a small image gallery,
 * for the homepage spotlight / product detail.
 */
export async function fetchProductByHandle(
  handle: string
): Promise<ProductDetail | null> {
  const query = `
    query Product($handle: String!) {
      productByHandle(handle: $handle) {
        ${PRODUCT_FIELDS}
        images(first: 6) { edges { node { url altText } } }
      }
    }
  `

  const data = await shopifyFetch<{
    productByHandle:
      | (ProductNode & { images: { edges: { node: { url: string; altText: string | null } }[] } })
      | null
  }>(query, { handle })

  const node = data.productByHandle
  if (!node) return null

  const base = mapProduct(node)
  const images = node.images.edges.map(({ node: img }) => img)
  return { ...base, images: images.length ? images : base.image ? [base.image] : [] }
}

interface CollectionNode {
  id: string
  title: string
  handle: string
  description: string
  image: { url: string; altText: string | null } | null
  products: { edges: { node: ProductNode }[] }
}

function mapCollection(node: CollectionNode): Collection {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    image:
      node.image ??
      // Fall back to the first product image so empty-thumbnail collections still look good.
      node.products?.edges[0]?.node.featuredImage ??
      null,
    productCount: node.products?.edges.length ?? 0,
  }
}

/**
 * Fetch all collections with a representative image (its own, or first product's).
 */
export async function fetchCollections(limit = 50): Promise<Collection[]> {
  const query = `
    query Collections($limit: Int!) {
      collections(first: $limit, sortKey: TITLE) {
        edges {
          node {
            id
            title
            handle
            description
            image { url altText }
            products(first: 1) {
              edges { node { featuredImage { url altText } } }
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch<{
    collections: { edges: { node: CollectionNode }[] }
  }>(query, { limit })

  // Hide the auto-generated "Home page"/empty collections that have no products.
  return data.collections.edges
    .map(({ node }) => mapCollection(node))
    .filter((c) => c.image !== null)
}

/**
 * Fetch a single collection by handle, including its products.
 * Returns null if the handle doesn't exist.
 */
export async function fetchCollection(
  handle: string
): Promise<{ collection: Collection; products: Product[] } | null> {
  const query = `
    query Collection($handle: String!) {
      collectionByHandle(handle: $handle) {
        id
        title
        handle
        description
        image { url altText }
        products(first: 100) {
          edges { node { ${PRODUCT_FIELDS} } }
        }
      }
    }
  `

  const data = await shopifyFetch<{
    collectionByHandle:
      | (CollectionNode & { products: { edges: { node: ProductNode }[] } })
      | null
  }>(query, { handle })

  const node = data.collectionByHandle
  if (!node) return null

  const products = node.products.edges.map(({ node: p }) => mapProduct(p))
  return {
    collection: {
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description,
      image: node.image ?? products[0]?.image ?? null,
      productCount: products.length,
    },
    products,
  }
}

/**
 * Create a new (empty) cart.
 */
export async function createCart(): Promise<Cart> {
  const query = `
    mutation CartCreate {
      cartCreate {
        cart { ${CART_FRAGMENT} }
        userErrors { field message }
      }
    }
  `

  const data = await shopifyFetch<{
    cartCreate: { cart: Cart; userErrors: UserError[] }
  }>(query)
  const { cart, userErrors } = data.cartCreate

  if (userErrors?.length) {
    throw new Error(userErrors.map((e) => e.message).join('; '))
  }

  return cart
}

/**
 * Add a variant to an existing cart.
 */
export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<Cart> {
  const query = `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FRAGMENT} }
        userErrors { field message }
      }
    }
  `

  const variables = {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  }

  const data = await shopifyFetch<{
    cartLinesAdd: { cart: Cart; userErrors: UserError[] }
  }>(query, variables)
  const { cart, userErrors } = data.cartLinesAdd

  if (userErrors?.length) {
    throw new Error(userErrors.map((e) => e.message).join('; '))
  }

  return cart
}

/**
 * Fetch an existing cart by id. Returns null if it no longer exists.
 */
export async function getCart(cartId: string): Promise<Cart | null> {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ${CART_FRAGMENT} }
    }
  `

  const data = await shopifyFetch<{ cart: Cart | null }>(query, { cartId })
  return data.cart
}
