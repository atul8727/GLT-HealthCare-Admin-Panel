/**
 * authService.js — REAL authentication against the GLT Healthcare backend.
 * Endpoint: POST /api/auth/login  (base URL from src/config/env.js)
 *
 * Expected response shape:
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "token": "...",
 *     "user": { "admin_id": 1, "name": "GLT Admin", "email": "...", "role": "admin" }
 *   }
 * }
 *
 * NOTE ON SESSION STORAGE: the session intentionally lives in
 * sessionStorage (not localStorage). That means the admin stays logged in
 * across reloads and while navigating around the app, but closing the
 * browser tab/window clears the session — so it has to be logged into
 * again next time the app is opened fresh.
 */
import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

const TOKEN_KEY = "glt_auth_token";
const USER_KEY = "glt_auth_user";

export const authService = {
  /**
   * @param {{ email: string, password: string, role?: string }} credentials
   * role defaults to "admin" since only the Admin Panel exists today.
   */
  login: async ({ email, password, role = "admin" }) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password, role });

    if (!response?.success) {
      throw new Error(response?.message || "Login failed. Please try again.");
    }

    const { token, user } = response.data || {};
    if (!token || !user) {
      throw new Error("Unexpected response from server.");
    }

    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));

    return { user, token };
  },

  logout: async () => {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Even if the logout call fails (endpoint down, network issue),
      // always clear the local session so the user is signed out client-side.
    } finally {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    }
  },

  getCurrentUser: () => {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  getToken: () => sessionStorage.getItem(TOKEN_KEY),

  isAuthenticated: () => Boolean(sessionStorage.getItem(TOKEN_KEY)),
};

export default authService;