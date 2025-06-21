const WORDPRESS_API_URL = 'https://your-wordpress-site.com/wp-json/'; // Replace with actual URL

/**
 * Fetches data from the WordPress REST API.
 * @param {string} endpoint - The API endpoint (e.g., 'wp/v2/pages').
 * @param {object} params - Query parameters for the request.
 * @param {string} languageCode - Language code for WPML (e.g., 'en', 'fa', 'ar').
 * @returns {Promise<any>} - The JSON response from the API.
 */
async function fetchWordPressData(endpoint, params = {}, languageCode = 'en') {
  const queryParams = new URLSearchParams(params);
  if (languageCode) {
    queryParams.append('lang', languageCode);
  }

  const url = `${WORDPRESS_API_URL}${endpoint}?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch WordPress data:", error);
    // In a real app, you might want to throw the error or handle it in a more user-friendly way
    return null;
  }
}

/**
 * Fetches a specific page by slug or ID.
 * Assumes pages are set up to be queryable by slug.
 * For fetching by slug, the endpoint might need to be /wp/v2/pages?slug=your-slug
 * For fetching by ID, it's /wp/v2/pages/ID
 * This function simplifies by assuming we can fetch a unique page (like 'home' or 'about')
 * usually by ensuring its slug is unique and using the slug parameter.
 * WordPress might return an array, so we take the first element.
 * @param {string} slug - The page slug (e.g., 'home').
 * @param {string} languageCode - Language code.
 * @param {object} params - Additional query parameters (e.g., { _embed: true }).
 * @returns {Promise<object|null>} - The page object or null if not found/error.
 */
export async function getPage(slug, languageCode, params = {}) {
  const queryParams = { slug, ...params };
  const response = await fetchWordPressData('wp/v2/pages', queryParams, languageCode);

  if (response && response.length > 0) {
    return response[0];
  }
  console.warn(`Page with slug "${slug}" not found or API structure different for language "${languageCode}".`);
  return null;
}

/**
 * Fetches posts of a specific CPT.
 * @param {string} postType - The CPT slug (e.g., 'story', 'testimonial').
 * @param {object} params - Additional query parameters (e.g., per_page, categories).
 * @param {string} languageCode - Language code.
 * @returns {Promise<Array|null>} - An array of posts or null.
 */
export async function getPosts(postType, params = {}, languageCode) {
  return fetchWordPressData(`wp/v2/${postType}`, params, languageCode);
}

// Example for fetching ACF options page if you have one (conceptual)
// export async function getSiteOptions(languageCode) {
//   return fetchWordPressData('acf/v3/options/options', {}, languageCode);
// }

// Note: For ACF fields to appear, you usually need either:
// 1. ACF PRO with "Show in REST API" enabled for field groups.
// 2. A plugin like "ACF to REST API".
// The data structure in the response will be `response.acf`.
// For featured images, you might need `_embed` parameter to get image details.
// e.g. params: { _embed: true } in getPosts or getPage
// This will include a _embedded['wp:featuredmedia'][0].source_url
