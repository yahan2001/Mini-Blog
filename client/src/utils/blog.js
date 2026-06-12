export const stripHtml = (html = '') => {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export const getReadingTime = (html = '') => {
  const words = stripHtml(html).split(' ').filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}
