// Re-define or import from a central config if available
const WORDPRESS_BASE_URL = 'https://your-wordpress-site.com'; // Replace with actual URL

/**
 * Logs in a user via the JWT plugin.
 * @param {string} username - The username or email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} - The response object from the server, including token and user data on success.
 */
export async function login(username, password) {
  const response = await fetch(`${WORDPRESS_BASE_URL}/wp-json/jwt-auth/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // data.message often contains the error from WordPress (e.g., "Invalid username.")
    throw new Error(data.message || `Login failed: ${response.status}`);
  }

  // Store token and user data (example structure, depends on what JWT plugin returns)
  if (data.token) {
    localStorage.setItem('authToken', data.token);
    // Assuming user data is returned like this, adjust as per actual API response
    // e.g. data.user_email, data.user_nicename, data.user_display_name
    // For now, just storing what the basic JWT plugin might return directly with the token.
    // A separate call to /wp-json/wp/v2/users/me might be needed after token validation
    // to get full user details if not provided by the token endpoint.
    localStorage.setItem('currentUser', JSON.stringify({
        token: data.token, // Storing token here too for consistency if needed
        email: data.user_email,
        nicename: data.user_nicename,
        displayName: data.user_display_name,
        // id: data.id // if available
    }));
    return data; // contains token, user_email, user_nicename, user_display_name
  } else {
    throw new Error(data.message || 'Login successful but no token received.');
  }
}

/**
 * Validates an authentication token.
 * @param {string} token - The JWT token to validate.
 * @returns {Promise<object>} - The response from the server. Success usually means token is valid.
 */
export async function validateToken(token) {
  const response = await fetch(`${WORDPRESS_BASE_URL}/wp-json/jwt-auth/v1/token/validate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    // Token is invalid or expired
    throw new Error(data.message || `Token validation failed: ${response.status}`);
  }
  // If successful, the response might just be a success code or include some data.
  // The fact that it didn't throw an error means the token is valid.
  return data; // data.code === "jwt_auth_valid_token" or similar for success
}

/**
 * Logs out the user by removing the token from localStorage.
 */
export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  // No API call is typically needed for JWT logout on the client-side,
  // as JWTs are stateless. Token invalidation is handled by its expiry or server-side revocation if implemented.
}

/**
 * Gets the current user's data from localStorage.
 * @returns {object|null} - The user object or null if not found.
 */
export function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

/**
 * Gets the auth token from localStorage.
 * @returns {string|null} - The auth token or null if not found.
 */
export function getToken() {
  return localStorage.getItem('authToken');
}

/**
 * Registers a new user.
 * IMPORTANT: WordPress default /wp/v2/users endpoint requires authentication to create users.
 * For public registration, you typically need a plugin like "WP REST User" or specific configurations
 * to allow unauthenticated user creation, or the JWT plugin might offer its own registration endpoint.
 * This function assumes such an endpoint is available and accepts username, email, password.
 * A common approach is to use POST to /wp-json/wp/v2/users or a custom endpoint.
 *
 * @param {string} username - The desired username.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} - The response object from the server.
 */
export async function register(username, email, password) {
  // Note: The endpoint and exact payload might vary based on the WordPress setup/plugins for registration.
  // Using /wp/v2/users is standard but usually requires auth.
  // If your JWT plugin provides a specific registration endpoint, use that. E.g. /jwt-auth/v1/register
  const response = await fetch(`${WORDPRESS_BASE_URL}/wp-json/wp/v2/users/register`, { // OR /wp/v2/users
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // WordPress requires username, email, and password for registration.
    // Some plugins might use different field names or require additional fields.
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    // data.message often contains the error (e.g., "Existing user.", "Invalid email.")
    throw new Error(data.message || `Registration failed: ${response.status}`);
  }

  // On successful registration, WordPress usually returns the new user object (without password).
  // It does not automatically log in the user or return a token with this standard endpoint.
  return data;
}
