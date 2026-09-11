/**
 * enquiryService.js — REAL API for Enquiries.
 * Endpoints (base URL from src/config/env.js):
 *   POST   /api/enquiries                 -> create (public landing page form, no auth)
 *   GET    /api/enquiries?page&limit&status -> list (admin)
 *   GET    /api/enquiries/:id             -> detail (admin)
 *   DELETE /api/enquiries/:id             -> soft delete (admin)
 *
 * Backend response shape isn't confirmed yet from a live sample, so
 * mapEnquiry() below is written to tolerate a few likely field-name
 * variants (id vs enquiry_id, full_name vs name, etc.). Once you hit the
 * real API, check the Network tab and trim mapEnquiry() down to the exact
 * keys the backend actually sends — don't leave the fallbacks in forever.
 */
import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

function mapEnquiry(raw) {
  if (!raw) return null;
  return {
    id: raw.id ?? raw.enquiry_id,
    fullName: raw.full_name ?? raw.fullName ?? raw.name ?? "",
    mobile: raw.mobile ?? "",
    email: raw.email ?? "",
    consultationType: raw.consultation_type ?? raw.consultationType ?? "",
    message: raw.message ?? "",
    status: raw.status || "New",
    createdAt: raw.created_at ?? raw.createdAt,
    updatedAt: raw.updated_at ?? raw.updatedAt,
    deletedAt: raw.deleted_at ?? raw.deletedAt ?? null,
  };
}

export const enquiryService = {
  /**
   * @param {{page?: number, limit?: number, status?: string}} opts
   * status: "New" | "Contacted" | "Closed" (leave empty for all)
   * Returns { enquiries, pagination }. If the backend doesn't send
   * pagination meta yet, a best-effort { page, limit, totalPages } is
   * derived so the Pagination component still works.
   */
  getEnquiries: async ({ page = 1, limit = 20, status = "" } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set("status", status);

    const response = await apiClient.get(`${ENDPOINTS.ENQUIRIES.LIST}?${params.toString()}`);
    if (!response?.success) throw new Error(response?.message || "Failed to load enquiries.");

    const enquiries = (response.data || []).map(mapEnquiry);
    const pagination = response.pagination || {
      page,
      limit,
      total: response.total,
      totalPages: enquiries.length < limit ? page : page + 1,
    };

    return { enquiries, pagination };
  },

  getEnquiryById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.ENQUIRIES.DETAIL(id));
    if (!response?.success) throw new Error(response?.message || "Enquiry not found.");
    return mapEnquiry(response.data);
  },

  deleteEnquiry: async (id) => {
    const response = await apiClient.delete(ENDPOINTS.ENQUIRIES.DELETE(id));
    if (response && response.success === false) {
      throw new Error(response.message || "Failed to delete enquiry.");
    }
    return true;
  },
};

export default enquiryService;