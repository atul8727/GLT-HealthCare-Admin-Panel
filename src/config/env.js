/**
 * env.js — centralized environment/config access.
 * Never hardcode the API base URL anywhere else in the app — always import
 * API_BASE_URL from here.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://glt.fctesting.shop";

/**
 * Per-feature switch so we can migrate module by module from localStorage
 * to the real API as endpoints become available, without breaking modules
 * that aren't wired up yet.
 * Flip a feature to false once its *Service.js file is switched to apiClient.
 */
export const USE_LOCAL_STORAGE = {
  auth: false, // ✅ real API (/api/auth/login)
  patients: false, // ✅ real API (/api/patients)
  doctors: true,
  appointments: true,
  prescriptions: true,
  users: true,
  settings: true,
};