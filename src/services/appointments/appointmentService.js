import localStorageClient from "../storage/localStorageClient";

const COLLECTION = "appointments";
const ID_PREFIX = "GLT-A";

localStorageClient.seedIfEmpty(COLLECTION, [
  {
    id: "GLT-A-000001",
    patientId: "GLT-P-000124",
    patientName: "Rahul Kumar",
    doctorId: "GLT-D-000010",
    doctorName: "Dr. Rahul Sharma",
    date: new Date().toISOString().slice(0, 10),
    time: "10:00 AM",
    type: "Online",
    meetLink: "https://meet.google.com/abc-defg-hij",
    status: "Scheduled",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

export const appointmentService = {
  getAppointments: () => localStorageClient.getAll(COLLECTION),
  getAppointmentById: (id) => localStorageClient.getById(COLLECTION, id),
  createAppointment: (payload) =>
    localStorageClient.create(COLLECTION, payload, { idPrefix: ID_PREFIX }),
  updateAppointment: (id, payload) => localStorageClient.update(COLLECTION, id, payload),
  cancelAppointment: (id) =>
    localStorageClient.update(COLLECTION, id, { status: "Cancelled" }),
  deleteAppointment: (id) => localStorageClient.remove(COLLECTION, id),
};

export default appointmentService;
