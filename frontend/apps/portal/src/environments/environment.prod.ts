// Production environment
// This will be replaced at build time with actual values

// Helper function to ensure HTTPS when page is served over HTTPS
function ensureHttps(url: string | undefined, fallback: string): string {
  const targetUrl = url || fallback;
  
  // If page is HTTPS, ensure API URL is also HTTPS
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    // Replace http:// with https://
    let normalizedUrl = targetUrl.replace(/^http:\/\//i, 'https://');
    // If URL doesn't have protocol, add https://
    if (!normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    return normalizedUrl;
  }
  
  // For non-HTTPS pages, return as-is but ensure it has a protocol
  if (!targetUrl.match(/^https?:\/\//i)) {
    return 'https://' + targetUrl;
  }
  
  return targetUrl;
}

export const environment = {
  production: true,
  apiUrl: ensureHttps((window as any).__ENV__?.API_URL, 'https://api.menindata.org'),
  gatewayUrl: ensureHttps((window as any).__ENV__?.GATEWAY_URL, 'https://api.menindata.org'),
  frontendUrl: ensureHttps((window as any).__ENV__?.FRONTEND_URL, 'https://menindata.org')
};

