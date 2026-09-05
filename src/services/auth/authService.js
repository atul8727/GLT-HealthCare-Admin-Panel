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

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return { user, token };
  },

  logout: async () => {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Even if the logout call fails (endpoint down, network issue),
      // always clear the local session so the user is signed out client-side.
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  getCurrentUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  isAuthenticated: () => Boolean(localStorage.getItem(TOKEN_KEY)),
};

export default authService;