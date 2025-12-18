// For local development (npm start):
// export const environment = {
//   production: false,
//   apiUrl: 'https://localhost:8080', // Gateway with HTTPS
// };

// For Docker deployment (docker-compose):
export const environment = {
  production: false,
  apiUrl: '', // Empty = use relative URLs, proxied by nginx in Docker
};
