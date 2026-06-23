const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

console.log(process.env.NEXT_PUBLIC_API_BASE_URL);

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,

  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT: (slug: string) => `${API_BASE_URL}/products/${slug}`,

  ENHANCEMENTS: `${API_BASE_URL}/enhancements`,
  COVER_EXTRAS: `${API_BASE_URL}/cover-extras`,

  REVIEWS: `${API_BASE_URL}/reviews`,
  REVIEWS_LATEST: `${API_BASE_URL}/reviews/latest`,

  INSTAGRAM: `${API_BASE_URL}/instagram`,

  CONTACT: `${API_BASE_URL}/contact`,
  NEWSLETTER: `${API_BASE_URL}/newsletter`,

  NEWS: `${API_BASE_URL}/news/public`,
  NEWS_ITEM: (slug: string) => `${API_BASE_URL}/news/public/${slug}`,
  NEWS_ADMIN: `${API_BASE_URL}/news`,

  DASHBOARD: `${API_BASE_URL}/dashboard`,

  UPLOAD: `${API_BASE_URL}/upload`,

  USERS: `${API_BASE_URL}/admins`,
  ME: `${API_BASE_URL}/auth/me`,

  // CMS Pages
  PAGES: `${API_BASE_URL}/pages`,
  PAGE: (slug: string) => `${API_BASE_URL}/pages/${slug}`,
  PAGE_BY_ID: (id: number) => `${API_BASE_URL}/pages/${id}`,

  // CMS Page Sections
  PAGE_SECTIONS_BY_PAGE: (pageId: number) =>
    `${API_BASE_URL}/page-sections/page/${pageId}`,
  PAGE_SECTION: (id: number) => `${API_BASE_URL}/page-sections/${id}`,
  PAGE_SECTIONS_REORDER: `${API_BASE_URL}/page-sections/reorder/sort`,

  // CMS Navigation
  NAVIGATION_LINKS: `${API_BASE_URL}/navigation-links`,
  NAVIGATION_TREE: `${API_BASE_URL}/navigation-links/tree`,
  NAVIGATION_LINK: (id: number) => `${API_BASE_URL}/navigation-links/${id}`,
  NAVIGATION_REORDER: `${API_BASE_URL}/navigation-links/reorder/sort`,
};
