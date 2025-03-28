export function formatNumber(number: number) {
  if (typeof number !== 'number') {
    number = Number(number)
  }

  return number.toLocaleString('de-DE')
}

export function formatPrice(price: number) {
  if (typeof price !== 'number') {
    price = Number(price)
  }
  
  return price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
}