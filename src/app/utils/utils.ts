/**
 * Escapes special HTML characters to prevent HTML/JS injection.
 * @param {string} str - The string to escape.
 * @returns {string} - The escaped string safe for HTML output.
 */
export function escapeHtml(str?: string) {
  if (!str) {
    return '';
  }
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#47;');
}
