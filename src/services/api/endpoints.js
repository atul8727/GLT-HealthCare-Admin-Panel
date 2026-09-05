/**
 * endpoints.js — every backend API path lives here, nowhere else.
 * When a *Service.js file needs a new endpoint, add it here first, then
 * reference it as ENDPOINTS.SECTION.NAME in the service. Never hardcode a
 * path string directly inside a service or component.
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
  },
  PATIENTS: {
    LIST: "/api/patients",
    CREATE: "/api/patients",
    DETAIL: (id) => `/api/patients/${id}`,
    UPDATE: (id) => `/api/patients/${id}`,
    DELETE: (id) => `/api/patients/${id}`,
  },

VITALS: {
    CREATE: "/api/vitals/",
    BY_PATIENT: (patientId) => `/api/vitals/patient/${patientId}`,
    DETAIL: (id) => `/api/vitals/${id}`,
    UPDATE: (id) => `/api/vitals/${id}`,
    DELETE: (id) => `/api/vitals/${id}`,
  },

};

