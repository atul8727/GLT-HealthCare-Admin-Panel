import localStorageClient from "../storage/localStorageClient";

const COLLECTION = "prescriptions";
const ID_PREFIX = "RX";

localStorageClient.seedIfEmpty(COLLECTION, [
  {
    id: "RX-000124",
    patientId: "GLT-P-000124",
    patientName: "Rahul Kumar",
    doctorId: "GLT-D-000010",
    doctorName: "Dr. Rahul Sharma",
    date: new Date().toISOString().slice(0, 10),
    diagnosis: "Viral Fever",
    medicines: [
      { name: "Paracetamol", dosage: "500mg", frequency: "Twice a day", duration: "5 days" },
      { name: "Cetirizine", dosage: "10mg", frequency: "Once at night", duration: "5 days" },
    ],
    advice: "Take adequate rest and fluids.",
    followUp: "After 5 days",
    status: "Generated",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

export const prescriptionService = {
  getPrescriptions: () => localStorageClient.getAll(COLLECTION),
  getPrescriptionById: (id) => localStorageClient.getById(COLLECTION, id),
  createPrescription: (payload) =>
    localStorageClient.create(COLLECTION, payload, { idPrefix: ID_PREFIX }),
  updatePrescription: (id, payload) => localStorageClient.update(COLLECTION, id, payload),
  deletePrescription: (id) => localStorageClient.remove(COLLECTION, id),
};

export default prescriptionService;
