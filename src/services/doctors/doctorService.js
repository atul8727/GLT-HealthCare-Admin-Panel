import localStorageClient from "../storage/localStorageClient";

const COLLECTION = "doctors";
const ID_PREFIX = "GLT-D";

localStorageClient.seedIfEmpty(COLLECTION, [
  {
    id: "GLT-D-000010",
    name: "Dr. Rahul Sharma",
    specialization: "Cardiologist",
    qualification: "MBBS, MD",
    mobile: "9812345678",
    email: "dr.sharma@glthealthcare.com",
    registrationNumber: "REG-1023",
    experience: "10 years",
    consultationFee: "500",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "GLT-D-000011",
    name: "Dr. Priya Singh",
    specialization: "Dermatologist",
    qualification: "MBBS, MD",
    mobile: "9812399999",
    email: "dr.priya@glthealthcare.com",
    registrationNumber: "REG-1044",
    experience: "6 years",
    consultationFee: "400",
    status: "Inactive",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

export const doctorService = {
  getDoctors: () => localStorageClient.getAll(COLLECTION),
  getDoctorById: (id) => localStorageClient.getById(COLLECTION, id),
  createDoctor: (payload) =>
    localStorageClient.create(COLLECTION, payload, { idPrefix: ID_PREFIX }),
  updateDoctor: (id, payload) => localStorageClient.update(COLLECTION, id, payload),
  deleteDoctor: (id) => localStorageClient.remove(COLLECTION, id),
  toggleStatus: async (id) => {
    const doctor = await localStorageClient.getById(COLLECTION, id);
    if (!doctor) throw new Error("Doctor not found");
    return localStorageClient.update(COLLECTION, id, {
      status: doctor.status === "Active" ? "Inactive" : "Active",
    });
  },
};

export default doctorService;
