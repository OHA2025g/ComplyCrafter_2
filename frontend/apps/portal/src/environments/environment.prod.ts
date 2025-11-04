// Production environment
// This will be replaced at build time with actual values
export const environment = {
  production: true,
  apiUrl: (window as any).__ENV__?.API_URL || 'https://api.menindata.org',
  gatewayUrl: (window as any).__ENV__?.GATEWAY_URL || 'https://api.menindata.org',
  frontendUrl: (window as any).__ENV__?.FRONTEND_URL || 'https://menindata.org'
};

