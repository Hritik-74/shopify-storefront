import type { Money } from '@/types'

/**
 * Format a Shopify Money value using the browser's locale and the money's
 * own currency code (so INR renders as ₹, USD as $, etc.).
 */
export function formatPrice(price: Money | null): string {
  if (!price) return ''
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: price.currencyCode,
      maximumFractionDigits: 2,
    }).format(Number(price.amount))
  } catch {
    // Unknown currency code — fall back to a plain amount.
    return `${Number(price.amount).toFixed(2)} ${price.currencyCode}`
  }
}
