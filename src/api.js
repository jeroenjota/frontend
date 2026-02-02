const API_URL = import.meta.env.VITE_API_URL 
// export function api(path) {
//   // console.log("API call:", `${API_URL}${path}`);
//   return `${API_URL}${path}`;
// }

function normalize(base, path) {
  if (!base) return path
  if (!path) return base
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

/**
 * API endpoints (JSON)
 * @example apiUrl('/tours')
 */
export function apiUrl(path = '') {
  return normalize(import.meta.env.VITE_API_BASE, path)
}

/**
 * Static assets (images, uploads)
 * @example assetUrl('/uploads/resized/x.jpg')
 */
export function assetUrl(path = '') {
  const base = import.meta.env.DEV
    ? '' // DEV → Vite proxy
    : import.meta.env.VITE_ASSET_BASE

  return normalize(base, path)
}