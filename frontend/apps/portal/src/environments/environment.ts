// Development environment
// Helper function to ensure HTTPS when page is served over HTTPS
function ensureHttps(url: string): string {
  // If page is HTTPS, ensure API URL is also HTTPS
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    // Replace http:// with https://
    url = url.replace(/^http:\/\//, 'https://');
    // If URL doesn't have protocol, add https://
    if (!url.match(/^https?:\/\//)) {
      url = 'https://' + url;
    }
  } else {
    // For development on HTTP, use http://
    if (!url.match(/^https?:\/\//)) {
      url = 'http://' + url;
    }
  }
  
  return url;
}

export const environment = {
  production: false,
  apiUrl: ensureHttps('api.menindata.org'),
  gatewayUrl: ensureHttps('api.menindata.org'),
  frontendUrl: ensureHttps('menindata.org')
};

