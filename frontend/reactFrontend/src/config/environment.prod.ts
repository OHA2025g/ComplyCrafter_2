// Production environment
export const environment = {
  production: true,
  apiUrl: process.env.VITE_API_URL || 'https://api.complycrafter.com',
  gatewayUrl: process.env.VITE_GATEWAY_URL || 'https://gateway.complycrafter.com',
  frontendUrl: process.env.VITE_FRONTEND_URL || 'https://complycrafter.com'
};



