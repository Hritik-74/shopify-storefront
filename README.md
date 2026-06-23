# Headless Shopify Storefront

A minimal headless Shopify storefront built with **Vite + React**, talking to the
Shopify **Storefront API** (GraphQL).

## Features

- `src/lib/shopify.js` — Storefront API client: `fetchProducts()`, `createCart()`, `addToCart()`, `getCart()`
- Products page with image, title, price, and **Add to Cart**
- Cart sidebar with line items, total quantity, and a **Checkout** button that redirects to Shopify's hosted `checkoutUrl`
- Cart state via React Context (`CartContext`), persisted to `localStorage`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the env template and fill in your store details:
   ```bash
   cp .env.example .env
   ```
   ```
   VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_TOKEN=your_token_here
   ```

   Get a Storefront access token from your Shopify admin:
   **Settings → Apps and sales channels → Develop apps → Create an app →
   Configure Storefront API scopes** (enable `unauthenticated_read_product_listings`
   and the cart scopes), then install the app and copy the **Storefront API access token**.

3. Run the dev server:
   ```bash
   npm run dev
   ```

## Notes

- The Storefront API token is a *public* token — it is safe to ship in client-side
  code (it only exposes data you scope it to).
- Checkout is handled by Shopify's hosted checkout via `cart.checkoutUrl`.
