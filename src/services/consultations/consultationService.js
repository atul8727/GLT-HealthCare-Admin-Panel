/**
 * consultationService.js — REAL API for Consultations.
 *
 *   GET  /api/consultations              -> list
 *   GET  /api/consultations/:id          -> detail
 *   POST /api/consultations              -> schedule a new consultation
 *   PUT  /api/consultations/:id/schedule -> reschedule (only while status === "Scheduled")
 *   PUT  /api/consultations/:id/cancel   -> cancel (only while status === "Scheduled")
 *
 * NOT included here on purpose (these belong to the doctor-side app, not
 * this admin panel):
 *   PUT /api/consultations/:id/clinical  -> doctor fills chief complaint /
 *                                            diagnosis / notes after the visit
 *   GET /api/vitals/consultation/:id     -> vitals recorded by the doctor
 * Both are still readable as plain fields on the consultation record below
 * (useful to *show* on the details screen), we just don't build an editor
 * for them here.
 */
import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

function mapConsultation(raw) {
  if (!raw) return null;
  return {
    id: raw.consultation_id,
    patientId: raw.patient_id,
    doctorId: raw.doctor_id,
    createdBy: raw.created_by,
    date: raw.consultation_date,
    time: raw.consultation_time,
    type: raw.consultation_type,
    meetLink: raw.meet_link || "",
    status: raw.status,
    // Filled in by the doctor after the consultation — read-only here.
    chiefComplaint: raw.chief_complaint,
    medicalHistory: raw.medical_history,
    examinationNotes: raw.examination_notes,
    diagnosis: raw.diagnosis,
    consultationNotes: raw.consultation_notes,
    advice: raw.advice,
    followUpRecommendation: raw.follow_up_recommendation,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    deletedAt: raw.deleted_at,
  };
}

function buildSchedulePayload(form) {
  return {
    patient_id: Number(form.patientId),
    doctor_id: Number(form.doctorId),
    consultation_date: form.date,
    consultation_time: form.time,
    consultation_type: form.type,
    meet_link: form.meetLink || "",
  };
}

export const consultationService = {
  getConsultations: async () => {
    const response = await apiClient.get(ENDPOINTS.CONSULTATIONS.LIST);
    if (!response?.success) throw new Error(response?.message || "Failed to load consultations.");
    return (response.data || []).map(mapConsultation);
  },

  getConsultationById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.CONSULTATIONS.DETAIL(id));
    if (!response?.success) throw new Error(response?.message || "Consultation not found.");
    return mapConsultation(response.data);
  },

  createConsultation: async (form) => {
    const response = await apiClient.post(
      ENDPOINTS.CONSULTATIONS.CREATE,
      buildSchedulePayload(form)
    );
    if (!response?.success) throw new Error(response?.message || "Failed to schedule consultation.");
    return mapConsultation(response.data);
  },

  // Backend only allows this while status === "Scheduled", else 400
  // ("Cannot reschedule a consultation with status 'X'").
  rescheduleConsultation: async (id, form) => {
    const response = await apiClient.put(
      ENDPOINTS.CONSULTATIONS.RESCHEDULE(id),
      buildSchedulePayload(form)
    );
    if (!response?.success) throw new Error(response?.message || "Failed to reschedule consultation.");
    return mapConsultation(response.data);
  },

  // Backend only allows this while status === "Scheduled".
  cancelConsultation: async (id) => {
    const response = await apiClient.put(ENDPOINTS.CONSULTATIONS.CANCEL(id));
    if (!response?.success) throw new Error(response?.message || "Failed to cancel consultation.");
    return response.data;
  },
};

export default consultationService;