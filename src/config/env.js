/**
 * env.js — centralized environment/config access.
 *
 * Currently the app runs entirely on localStorage (see services/storage),
 * so VITE_API_BASE_URL is not used yet. It's wired up now so that switching
 * to the real backend later is just: fill in .env + build apiClient.js.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export const USE_LOCAL_STORAGE = true; // flip to false once apiClient.js is ready
