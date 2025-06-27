/**
 * Get a cookie value by name
 * @param {string} name - The name of the cookie
 * @returns {string|null} The cookie value or null if not found
 */

export function getCookie(name) {
  const cookies = document.cookie.split(";");
  const prefix = `${encodeURIComponent(name)}=`;

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(prefix)) {
      return decodeURIComponent(cookie.substring(prefix.length));
    }
  }

  return null;
}
