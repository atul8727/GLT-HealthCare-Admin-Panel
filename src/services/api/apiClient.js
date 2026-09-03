/**
 * apiClient.js — FUTURE REST API CLIENT (not active yet)
 * ----------------------------------------------------------------------------
 * The app currently runs on `services/storage/localStorageClient.js`.
 * When the backend is ready:
 *
 *   1. Set VITE_API_BASE_URL in your .env file.
 *   2. Finish the methods below (they mirror localStorageClient's shape:
 *      getAll, getById, create, update, remove) using fetch + endpoints.js.
 *   3. In each `services/<feature>/<feature>Service.js`, change the import
 *      from `localStorageClient` to `apiClient`. Nothing in pages/components
 *      needs to change since they only ever call the *Service functions.
 *
 * This keeps the migration a one-line-per-service change.
 * ----------------------------------------------------------------------------
 */
import { API_BASE_URL } from "../../config/env";

function getToken() {
  return localStorage.getItem("glt_auth_token");
}

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

const apiClient = {
  getAll: (collectionPath) => request(`/${collectionPath}`),
  getById: (collectionPath, id) => request(`/${collectionPath}/${id}`),
  create: (collectionPath, payload) =>
    request(`/${collectionPath}`, { method: "POST", body: payload }),
  update: (collectionPath, id, payload) =>
    request(`/${collectionPath}/${id}`, { method: "PUT", body: payload }),
  remove: (collectionPath, id) =>
    request(`/${collectionPath}/${id}`, { method: "DELETE" }),
};

export default apiClient;
