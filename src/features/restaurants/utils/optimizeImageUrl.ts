/**
 * Appends Unsplash CDN transform parameters to an image URL so the browser
 * receives a smaller, next-gen-format payload.
 *
 * - `w`  – intrinsic width in pixels (the CDN will resize server-side)
 * - `q`  – quality (75 is a good balance between fidelity and size)
 * - `fm` – format (WebP provides ~30 % savings over JPEG at equal quality)
 * - `fit=crop` – ensures the image fills the requested dimensions
 *
 * Non-Unsplash URLs are returned unchanged.
 */
export function optimizeImageUrl(url: string, width = 800): string {
  if (!url || !url.includes('images.unsplash.com')) {
    return url
  }

  const separator = url.includes('?') ? '&' : '?'

  return `${url}${separator}w=${width}&q=75&fm=webp&fit=crop`
}
