export default function (text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}