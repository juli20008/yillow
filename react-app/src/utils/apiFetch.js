/**
 * Wraps the native fetch() so every /api/... call is prefixed with
 * REACT_APP_API_URL in production (Vercel → Render).
 *
 * In development the value is "" (empty string), so relative paths work
 * unchanged through the CRA proxy ("proxy": "http://localhost:5000").
 *
 * Usage: replace  fetch("/api/foo", opts)
 *         with   apiFetch("/api/foo", opts)
 */
const API_BASE = process.env.REACT_APP_API_URL || "";

const apiFetch = (path, options) => fetch(`${API_BASE}${path}`, options);
export default apiFetch;
