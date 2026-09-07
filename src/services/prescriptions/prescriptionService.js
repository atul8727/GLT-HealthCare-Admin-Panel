/**
 * prescriptionService.js — REAL API for Prescriptions.
 *
 *   GET /api/prescriptions/patient/:patientId       -> all prescriptions for a patient
 *   GET /api/prescriptions/consultation/:consultationId -> the prescription for one consultation
 *   GET /api/prescriptions/:id                      -> single prescription by id
 *
 * NOT included here on purpose: creating a prescription
 * (POST /api/prescriptions/consultation/:consultationId) is filled in by the
 * doctor during/after the consultation — that's the Doctor Panel's job, not
 * this admin panel (same convention as consultation "Clinical Notes", see
 * consultationService.js). Admin only ever views/downloads/prints here.
 *
 * Backend uses snake_case (prescription_id, tests_recommended, medicines[]
 * with prescription_medicine_id/medicine_name...). This file is the only
 * place that maps that to the camelCase shape the rest of the app uses.
 */
import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

function mapMedicine(raw) {
  if (!raw) return null;
  return {
    id: raw.prescription_medicine_id,
    name: raw.medicine_name,
    dosage: raw.dosage,
    frequency: raw.frequency,
    duration: raw.duration,
    instructions: raw.instructions,
  };
}

function mapPrescription(raw) {
  if (!raw) return null;
  return {
    id: raw.prescription_id,
    consultationId: raw.consultation_id,
    patientId: raw.patient_id,
    doctorId: raw.doctor_id,
    testsRecommended: raw.tests_recommended || "",
    additionalAdvice: raw.additional_advice || "",
    followUpDate: raw.follow_up_date || "",
    status: raw.status || "Active",
    medicines: (raw.medicines || []).map(mapMedicine),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    deletedAt: raw.deleted_at,
  };
}

// A patient/consultation legitimately having *no* prescription yet is not
// an error state for the UI — callers get `null` back instead of a thrown
// exception in that one case, so screens can just render an empty state.
function isNotFound(err) {
  return err?.status === 404;
}

export const prescriptionService = {
  getByPatient: async (patientId) => {
    const response = await apiClient.get(ENDPOINTS.PRESCRIPTIONS.BY_PATIENT(patientId));
    if (!response?.success) throw new Error(response?.message || "Failed to load prescriptions.");
    return (response.data || []).map(mapPrescription);
  },

  getByConsultation: async (consultationId) => {
    try {
      const response = await apiClient.get(ENDPOINTS.PRESCRIPTIONS.BY_CONSULTATION(consultationId));
      if (!response?.success) return null;
      return mapPrescription(response.data);
    } catch (err) {
      if (isNotFound(err)) return null;
      throw err;
    }
  },

  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.PRESCRIPTIONS.DETAIL(id));
    if (!response?.success) throw new Error(response?.message || "Prescription not found.");
    return mapPrescription(response.data);
  },
};

export default prescriptionService;