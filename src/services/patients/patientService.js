/**
 * patientService.js — REAL API for Patients.
 *
 * Backend uses snake_case field names (patient_id, emergency_contact,
 * registered_by...). This file is the ONLY place that translates between
 * the backend shape and the camelCase shape the rest of the app already
 * uses (id, emergencyContact, registeredBy...). Pages/components never see
 * raw API responses — they only ever get the mapped shape below.
 *
 * Vitals now live in their own service — see services/vitals/vitalService.js.
 */
import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import authService from "../auth/authService";

/**
 * Maps one backend patient record -> the shape used across the app.
 * NOTE: dob comes back from the backend as a full ISO datetime
 * (e.g. "1998-05-14T18:30:00.000Z" for a date the user entered as
 * "1998-05-15"). That's a timezone conversion happening on the backend
 * (local date cast to UTC). We just take the date portion as-is here —
 * if you notice dates showing one day off, flag it to the backend team
 * (they should store/return a date-only value, or handle the timezone
 * offset before saving).
 */
function mapPatient(raw) {
  if (!raw) return null;
  return {
    id: raw.patient_id,
    name: raw.name,
    mobile: raw.mobile,
    dob: raw.dob ? String(raw.dob).slice(0, 10) : "",
    age: raw.age,
    gender: raw.gender,
    address: raw.address || "",
    email: raw.email || "",
    emergencyContact: raw.emergency_contact || "",
    registeredBy: raw.registered_by,
    status: raw.status || "Active",
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    deletedAt: raw.deleted_at,
  };
}

function calculateAgeFromDob(dob) {
  if (!dob) return undefined;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return undefined;
  const diff = Date.now() - birth.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}

/**
 * Builds the outgoing request body (camelCase form -> backend snake_case).
 * `age` is auto-calculated from `dob` — the form doesn't ask for it.
 * `registered_by` is sent as the logged-in admin's name (backend maps this
 * to the numeric admin id internally, per the sample response).
 */
function buildPayload(form) {
  const currentUser = authService.getCurrentUser();
  return {
    name: form.name,
    mobile: form.mobile,
    dob: form.dob,
    age: calculateAgeFromDob(form.dob),
    gender: form.gender,
    address: form.address || "",
    email: form.email || "",
    emergency_contact: form.emergencyContact || "",
    registered_by: currentUser?.name || "Admin",
  };
}

export const patientService = {
  getPatients: async () => {
    const response = await apiClient.get(ENDPOINTS.PATIENTS.LIST);
    if (!response?.success) throw new Error(response?.message || "Failed to load patients.");
    return (response.data || []).map(mapPatient);
  },

  getPatientById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.PATIENTS.DETAIL(id));
    if (!response?.success) throw new Error(response?.message || "Patient not found.");
    return mapPatient(response.data);
  },

  createPatient: async (form) => {
    const response = await apiClient.post(ENDPOINTS.PATIENTS.CREATE, buildPayload(form));
    if (!response?.success) throw new Error(response?.message || "Failed to create patient.");
    return mapPatient(response.data);
  },

  updatePatient: async (id, form) => {
    const response = await apiClient.put(ENDPOINTS.PATIENTS.UPDATE(id), buildPayload(form));
    if (!response?.success) throw new Error(response?.message || "Failed to update patient.");
    return mapPatient(response.data);
  },

  deletePatient: async (id) => {
    const response = await apiClient.delete(ENDPOINTS.PATIENTS.DELETE(id));
    if (response && response.success === false) {
      throw new Error(response.message || "Failed to delete patient.");
    }
    return true;
  },
};

export default patientService;