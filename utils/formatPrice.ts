export function formatPrice(price: number) {
  if (typeof price !== 'number') {
    price = Number(price)
  }
  
  return price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
}