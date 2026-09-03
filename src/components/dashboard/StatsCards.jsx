import { FiUsers, FiUserCheck, FiCalendar, FiClock } from "react-icons/fi";

const CARD_CONFIG = [
  { key: "totalPatients", label: "Total Patients", icon: FiUsers, color: "text-primary bg-primary-light" },
  { key: "totalDoctors", label: "Total Doctors", icon: FiUserCheck, color: "text-success bg-green-50" },
  { key: "todaysAppointments", label: "Today's Consultations", icon: FiCalendar, color: "text-info bg-sky-50" },
  { key: "upcomingConsultations", label: "Upcoming Consultations", icon: FiClock, color: "text-warning bg-amber-50" },
];

export default function StatsCards({ summary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARD_CONFIG.map((card) => (
        <div
          key={card.key}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">{card.label}</p>
              <p className="mt-1 text-2xl font-semibold text-text-primary">
                {summary ? summary[card.key] : "-"}
              </p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
