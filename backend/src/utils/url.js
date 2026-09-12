const isPrivateIpv4 = (hostname) => {
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return false
  const parts = hostname.split('.').map((part) => Number(part))
  if (parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
    return false
  }
  const [a, b] = parts
  if (a === 10) return true
  if (a === 127) return true
  if (a === 0) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 100 && b >= 64 && b <= 127) return true
  return false
}

const isCloudUrl = (value) => {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (!trimmed) return false
  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false
    }
    const hostname = (url.hostname || '').toLowerCase()
    if (!hostname) return false
    if (hostname === 'localhost' || hostname === '::1' || hostname.endsWith('.local')) {
      return false
    }
    if (isPrivateIpv4(hostname)) return false
    return true
  } catch (error) {
    return false
  }
}

export { isCloudUrl }
