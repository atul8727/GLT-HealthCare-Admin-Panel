/**
 * authService.js — MVP mock authentication (localStorage based).
 *
 * Any email/password combination below is accepted for demo purposes:
 *   admin@glthealthcare.com / any password  -> role ADMIN
 *   doctor@glthealthcare.com / any password -> role DOCTOR
 *
 * When the real backend is ready, replace the body of `login` with a call
 * to apiClient (POST /auth/login) and keep the same return shape
 * ({ user, token }) so AuthContext doesn't need to change.
 */

const TOKEN_KEY = "glt_auth_token";
const USER_KEY = "glt_auth_user";

function fakeToken() {
  return `demo-token-${Date.now()}`;
}

export const authService = {
  login: async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 300));

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const role = email.toLowerCase().includes("doctor") ? "DOCTOR" : "ADMIN";
    const user = {
      id: role === "ADMIN" ? "GLT-U-000001" : "GLT-D-000010",
      name: role === "ADMIN" ? "Admin User" : "Dr. Rahul Sharma",
      email,
      role,
    };
    const token = fakeToken();

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return { user, token };
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  isAuthenticated: () => Boolean(localStorage.getItem(TOKEN_KEY)),
};

export default authService;
