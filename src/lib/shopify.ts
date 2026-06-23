// Shopify Storefront API client.
// Talks to the GraphQL Storefront API using a public storefront access token.

import type { Cart, Product } from './types'

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
  products: {
    edges: {
      node: {
        id: string
        title: string
        description: string
        handle: string
        featuredImage: { url: string; altText: string | null } | null
        priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
        variants: { edges: { node: { id: string; availableForSale: boolean } }[] }
      }
    }[]
  }
}

/**
 * Fetch all products (first 100) with their first variant and image.
 */
export async function fetchProducts(): Promise<Product[]> {
  const query = `
    query Products {
      products(first: 100) {
        edges {
          node {
            id
            title
            description
            handle
            featuredImage { url altText }
            priceRange {
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
          }
        }
      }
    }
  `

  const data = await shopifyFetch<ProductsQuery>(query)

  return data.products.edges.map(({ node }) => {
    const variant = node.variants.edges[0]?.node
    return {
      id: node.id,
      title: node.title,
      description: node.description,
      handle: node.handle,
      image: node.featuredImage,
      price: node.priceRange.minVariantPrice,
      variantId: variant?.id ?? null,
      availableForSale: variant?.availableForSale ?? false,
    }
  })
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
