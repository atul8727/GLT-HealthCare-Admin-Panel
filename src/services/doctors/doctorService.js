/**
 * doctorService.js — REAL API for Doctors.
 * Endpoints (base URL from src/config/env.js):
 *   POST   /api/doctors                -> create
 *   GET    /api/doctors?page&limit&Search&specialization -> list
 *   GET    /api/doctors/:id            -> detail
 *   PUT    /api/doctors/:id            -> update (name, mobile, specialization)
 *   PUT    /api/doctors/:id/password   -> reset password
 *   PUT    /api/doctors/:id/status     -> Active / Inactive
 *   DELETE /api/doctors/:id            -> delete
 *
 * Backend uses doctor_id / created_at / updated_at. This file is the only
 * place that maps the raw API response to the shape the rest of the app
 * uses (id, createdAt, updatedAt...). Pages/components never see the raw
 * response directly.
 */
import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

function mapDoctor(raw) {
  if (!raw) return null;
  return {
    id: raw.doctor_id,
    name: raw.name,
    email: raw.email,
    mobile: raw.mobile,
    specialization: raw.specialization,
    status: raw.status || "Active",
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export const doctorService = {
  /**
   * @param {{page?: number, limit?: number, search?: string, specialization?: string}} opts
   * Returns { doctors, pagination }. If the backend doesn't send pagination
   * meta yet, we derive a best-effort { page, limit, totalPages } so the
   * Pagination component still works (Next disabled once a page comes back
   * shorter than `limit`).
   */
  getDoctors: async ({ page = 1, limit = 10, search = "", specialization = "" } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set("Search", search);
    if (specialization) params.set("specialization", specialization);

    const response = await apiClient.get(`${ENDPOINTS.DOCTORS.LIST}?${params.toString()}`);
    if (!response?.success) throw new Error(response?.message || "Failed to load doctors.");

    const doctors = (response.data || []).map(mapDoctor);
    const pagination = response.pagination || {
      page,
      limit,
      total: response.total,
      totalPages: doctors.length < limit ? page : page + 1,
    };

    return { doctors, pagination };
  },

  getDoctorById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.DOCTORS.DETAIL(id));
    if (!response?.success) throw new Error(response?.message || "Doctor not found.");
    return mapDoctor(response.data);
  },

  createDoctor: async (form) => {
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      mobile: form.mobile,
      specialization: form.specialization,
    };
    const response = await apiClient.post(ENDPOINTS.DOCTORS.CREATE, payload);
    if (!response?.success) throw new Error(response?.message || "Failed to create doctor.");
    return mapDoctor(response.data);
  },

  // Backend only accepts name/mobile/specialization on this route (email is fixed).
  updateDoctor: async (id, form) => {
    const payload = {
      name: form.name,
      mobile: form.mobile,
      specialization: form.specialization,
    };
    const response = await apiClient.put(ENDPOINTS.DOCTORS.UPDATE(id), payload);
    if (!response?.success) throw new Error(response?.message || "Failed to update doctor.");
    return mapDoctor(response.data);
  },

  updatePassword: async (id, password) => {
    const response = await apiClient.put(ENDPOINTS.DOCTORS.UPDATE_PASSWORD(id), { password });
    if (!response?.success) throw new Error(response?.message || "Failed to reset password.");
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await apiClient.put(ENDPOINTS.DOCTORS.UPDATE_STATUS(id), { status });
    if (!response?.success) throw new Error(response?.message || "Failed to update status.");
    return response.data;
  },

  toggleStatus: async (doctor) =>
    doctorService.updateStatus(doctor.id, doctor.status === "Active" ? "Inactive" : "Active"),

  deleteDoctor: async (id) => {
    const response = await apiClient.delete(ENDPOINTS.DOCTORS.DELETE(id));
    if (response && response.success === false) {
      throw new Error(response.message || "Failed to delete doctor.");
    }
    return true;
  },
};

export default doctorService;