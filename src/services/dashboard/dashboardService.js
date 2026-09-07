import patientService from "../patients/patientService";
import doctorService from "../doctors/doctorService";
import consultationService from "../consultations/consultationService";

/**
 * Dashboard doesn't own data — it aggregates numbers from the other
 * services. When a real backend exists, this could instead call a single
 * `/dashboard/summary` endpoint.
 */
export const dashboardService = {
  getSummary: async () => {
    const [patients, { doctors }, consultations] = await Promise.all([
      patientService.getPatients(),
      doctorService.getDoctors({ limit: 200 }),
      consultationService.getConsultations(),
    ]);

    const today = new Date().toISOString().slice(0, 10);
    const todaysConsultations = consultations.filter((c) => c.date === today);
    const upcoming = consultations.filter(
      (c) => c.date > today && c.status === "Scheduled"
    );

    const patientMap = Object.fromEntries(patients.map((p) => [p.id, p.name]));
    const doctorMap = Object.fromEntries(doctors.map((d) => [d.id, d.name]));

    return {
      totalPatients: patients.length,
      totalDoctors: doctors.length,
      todaysAppointments: todaysConsultations.length,
      upcomingConsultations: upcoming.length,
      recentPatients: [...patients].slice(-5).reverse(),
      todaysAppointmentsList: todaysConsultations.map((c) => ({
        ...c,
        patientName: patientMap[c.patientId] || "-",
        doctorName: doctorMap[c.doctorId] || "-",
      })),
    };
  },
};

export default dashboardService;
