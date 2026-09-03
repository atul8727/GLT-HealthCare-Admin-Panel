import patientService from "../patients/patientService";
import doctorService from "../doctors/doctorService";
import appointmentService from "../appointments/appointmentService";

/**
 * Dashboard doesn't own data — it aggregates numbers from the other
 * services. When a real backend exists, this could instead call a single
 * `/dashboard/summary` endpoint.
 */
export const dashboardService = {
  getSummary: async () => {
    const [patients, doctors, appointments] = await Promise.all([
      patientService.getPatients(),
      doctorService.getDoctors(),
      appointmentService.getAppointments(),
    ]);

    const today = new Date().toISOString().slice(0, 10);
    const todaysAppointments = appointments.filter((a) => a.date === today);
    const upcoming = appointments.filter(
      (a) => a.date > today && a.status === "Scheduled"
    );

    return {
      totalPatients: patients.length,
      totalDoctors: doctors.length,
      todaysAppointments: todaysAppointments.length,
      upcomingConsultations: upcoming.length,
      recentPatients: [...patients].slice(-5).reverse(),
      todaysAppointmentsList: todaysAppointments,
    };
  },
};

export default dashboardService;
