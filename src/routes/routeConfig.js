/**
 * Central route path constants — import these instead of hardcoding path
 * strings across the app (nav links, navigate(), redirects).
 */
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PATIENTS: "/patients",
  PATIENT_CREATE: "/patients/create",
  PATIENT_DETAILS: (id) => `/patients/${id}`,
  PATIENT_EDIT: (id) => `/patients/${id}/edit`,
  DOCTORS: "/doctors",
  DOCTOR_CREATE: "/doctors/create",
  DOCTOR_EDIT: (id) => `/doctors/${id}/edit`,
  CONSULTATIONS: "/consultations",
  CONSULTATION_CREATE: "/consultations/create",
  CONSULTATION_DETAILS: (id) => `/consultations/${id}`,
  MEDICAL_RECORDS: "/medical-records",
  PRESCRIPTIONS: "/prescriptions",
  PRESCRIPTION_DETAILS: (id) => `/prescriptions/${id}`,
  PROFILE: "/profile",
};
