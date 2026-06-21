const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://aim-website.onrender.com/api";

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,

  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT: (slug: string) => `${API_BASE_URL}/products/${slug}`,
  ENHANCEMENTS: `${API_BASE_URL}/enhancements`,
  COVER_EXTRAS: `${API_BASE_URL}/cover-extras`,
  REVIEWS: `${API_BASE_URL}/reviews`,
  INSTAGRAM: `${API_BASE_URL}/instagram`,
  CONTACT: `${API_BASE_URL}/contact`,
  NEWSLETTER_SUBSCRIBE: `${API_BASE_URL}/newsletter/subscribe`,

  NEWS: `${API_BASE_URL}/news/public`,
  NEWS_ITEM: (slug: string) => `${API_BASE_URL}/news/public/${slug}`,
  NEWS_ADMIN: `${API_BASE_URL}/news`,

  DASHBOARD: `${API_BASE_URL}/dashboard`,

  UPLOAD: `${API_BASE_URL}/upload`,
  USERS: `${API_BASE_URL}/admins`,
};
