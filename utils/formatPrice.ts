export function formatPrice(price: number) {
  return price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
}