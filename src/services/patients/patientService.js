/**
 * patientService.js
 * All patient-related data operations live here ONLY.
 * Pages/components never talk to storage directly — they call this file.
 *
 * To switch to a real backend later: replace `localStorageClient` with
 * `apiClient` (see services/api/apiClient.js) and update the collection
 * name below to match your API's endpoint path (e.g. "patients").
 */
import localStorageClient from "../storage/localStorageClient";

const COLLECTION = "patients";
const ID_PREFIX = "GLT-P";

// Seed a couple of demo patients so the UI isn't empty on first run.
localStorageClient.seedIfEmpty(COLLECTION, [
  {
    id: "GLT-P-000124",
    name: "Rahul Kumar",
    mobile: "9876543210",
    dob: "1998-04-12",
    gender: "Male",
    address: "Noida, UP",
    email: "rahul@example.com",
    emergencyContact: "9876500000",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "GLT-P-000125",
    name: "Priya Singh",
    mobile: "9876511111",
    dob: "2000-01-20",
    gender: "Female",
    address: "Greater Noida, UP",
    email: "priya@example.com",
    emergencyContact: "9876522222",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

export const patientService = {
  getPatients: () => localStorageClient.getAll(COLLECTION),
  getPatientById: (id) => localStorageClient.getById(COLLECTION, id),
  createPatient: (payload) =>
    localStorageClient.create(COLLECTION, payload, { idPrefix: ID_PREFIX }),
  updatePatient: (id, payload) => localStorageClient.update(COLLECTION, id, payload),
  deletePatient: (id) => localStorageClient.remove(COLLECTION, id),

  // Vitals are stored as an array field on the patient record for now.
  // Better long-term design (per spec): link vitals to a Consultation.
  addVitals: async (patientId, vitals) => {
    const patient = await localStorageClient.getById(COLLECTION, patientId);
    if (!patient) throw new Error("Patient not found");
    const vitalsHistory = patient.vitalsHistory || [];
    const newEntry = { ...vitals, recordedAt: new Date().toISOString() };
    return localStorageClient.update(COLLECTION, patientId, {
      vitalsHistory: [...vitalsHistory, newEntry],
    });
  },
};

export default patientService;
