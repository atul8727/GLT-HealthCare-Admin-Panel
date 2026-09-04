/**
 * vitalService.js — REAL API for patient Vitals.
 * Same mapping pattern as patientService.js: backend snake_case in,
 * camelCase out. Pages only ever see the mapped shape.
 */
import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import authService from "../auth/authService";

function mapVital(raw) {
  if (!raw) return null;
  return {
    id: raw.vital_id,
    patientId: raw.patient_id,
    consultationId: raw.consultation_id,
    bp: raw.blood_pressure,
    pulse: raw.pulse_rate,
    temperature: raw.temperature,
    spo2: raw.spo2,
    weight: raw.weight,
    height: raw.height,
    bmi: raw.bmi,
    recordedBy: raw.recorded_by,
    status: raw.status,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function calcBmi(weight, height) {
  const w = Number(weight);
  const h = Number(height);
  if (!w || !h) return undefined;
  const meters = h / 100;
  return Number((w / (meters * meters)).toFixed(1));
}

function buildPayload(patientId, form) {
  const currentUser = authService.getCurrentUser();
  // BMI: prefer whatever the form is holding (auto-calculated in the UI as
  // weight/height change, but editable by the user) so the value the admin
  // sees on screen is exactly the value sent to the API. Only fall back to
  // a fresh calculation if the form never set one.
  const bmi =
    form.bmi !== undefined && form.bmi !== "" && form.bmi !== null
      ? Number(form.bmi)
      : calcBmi(form.weight, form.height);

  return {
    patient_id: Number(patientId),
    blood_pressure: form.bp,
    pulse_rate: form.pulse ? Number(form.pulse) : undefined,
    temperature: form.temperature ? Number(form.temperature) : undefined,
    spo2: form.spo2 ? Number(form.spo2) : undefined,
    weight: form.weight ? Number(form.weight) : undefined,
    height: form.height ? Number(form.height) : undefined,
    bmi,
    recorded_by: currentUser?.admin_id || 1,
  };
}

export const vitalService = {
  getByPatient: async (patientId) => {
    const response = await apiClient.get(ENDPOINTS.VITALS.BY_PATIENT(patientId));
    if (!response?.success) throw new Error(response?.message || "Failed to load vitals.");
    return (response.data || []).map(mapVital);
  },

  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.VITALS.DETAIL(id));
    if (!response?.success) throw new Error(response?.message || "Failed to load vitals record.");
    return mapVital(response.data);
  },

  create: async (patientId, form) => {
    const response = await apiClient.post(ENDPOINTS.VITALS.CREATE, buildPayload(patientId, form));
    if (!response?.success) throw new Error(response?.message || "Failed to save vitals.");
    return mapVital(response.data);
  },

  update: async (id, patientId, form) => {
    const response = await apiClient.put(ENDPOINTS.VITALS.UPDATE(id), buildPayload(patientId, form));
    if (!response?.success) throw new Error(response?.message || "Failed to update vitals.");
    return mapVital(response.data);
  },

  remove: async (id) => {
    const response = await apiClient.delete(ENDPOINTS.VITALS.DELETE(id));
    if (response && response.success === false) {
      throw new Error(response.message || "Failed to delete vitals record.");
    }
    return true;
  },
};

export default vitalService;