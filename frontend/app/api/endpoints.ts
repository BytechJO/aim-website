const API_BASE_URL = "http://localhost:3000/api";

export const ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,

  // Products
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT: (slug: string) => `${API_BASE_URL}/products/${slug}`,

  // Reviews
  REVIEWS: `${API_BASE_URL}/reviews`,

  // Instagram
  INSTAGRAM: `${API_BASE_URL}/instagram`,

  // Contact
  CONTACT: `${API_BASE_URL}/contact`,

  // Newsletter
  NEWSLETTER_SUBSCRIBE: `${API_BASE_URL}/newsletter/subscribe`,
};
