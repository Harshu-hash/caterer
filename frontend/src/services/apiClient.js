import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const TOKEN_STORAGE_KEY = 'admin_token';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Admin auth uses a token in localStorage attached as an Authorization header,
// not a cookie — this sidesteps SameSite rules, third-party-cookie blocking,
// and stale-cache issues entirely, since the frontend explicitly controls
// when the token is sent instead of relying on browser cookie behavior.
apiClient.interceptors.request.use((config) => {
  const token = getStoredAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function setStoredAdminToken(token) {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // Storage unavailable (private browsing, disabled, quota, etc.) — the
    // in-memory admin state from the login response still works for this
    // page load, it just won't persist across a refresh.
  }
}

export function clearStoredAdminToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore — nothing to clear if storage was never writable.
  }
}

export function getStoredAdminToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function extractErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.message || fallback;
}

export function extractFieldErrors(error) {
  const errors = error?.response?.data?.errors;
  if (!Array.isArray(errors)) return {};
  return errors.reduce((acc, e) => {
    if (e.field) acc[e.field] = e.message;
    return acc;
  }, {});
}
