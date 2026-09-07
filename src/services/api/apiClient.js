/**
 * apiClient.js — production REST client.
 * Base URL comes from src/config/env.js (VITE_API_BASE_URL, .env file).
 * Every *Service.js file that has a real backend endpoint should call this
 * client instead of localStorageClient. See authService.js for the pattern.
 */
import { API_BASE_URL } from "../../config/env";

const TOKEN_KEY = "glt_auth_token";

// Session lives in sessionStorage on purpose — see authService.js for why.
function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const token = getToken();

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new Error("Network error — unable to reach the server. Please check your connection.");
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),

  // Generic resource helpers for future CRUD modules (patients, doctors, etc.)
  // once their endpoints are shared — keeps the same shape as localStorageClient
  // so migrating a *Service.js file later is a near copy-paste swap.
  getAll: (resourcePath) => request(`/${resourcePath}`),
  getById: (resourcePath, id) => request(`/${resourcePath}/${id}`),
  create: (resourcePath, payload) => request(`/${resourcePath}`, { method: "POST", body: payload }),
  update: (resourcePath, id, payload) =>
    request(`/${resourcePath}/${id}`, { method: "PUT", body: payload }),
  remove: (resourcePath, id) => request(`/${resourcePath}/${id}`, { method: "DELETE" }),
};

export default apiClient;