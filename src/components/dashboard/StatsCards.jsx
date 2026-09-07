import { FiUsers, FiUserCheck, FiCalendar, FiClock } from "react-icons/fi";

const CARD_CONFIG = [
  {
    key: "totalPatients",
    label: "Total Patients",
    icon: FiUsers,
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "bg-white/20",
  },
  {
    key: "totalDoctors",
    label: "Total Doctors",
    icon: FiUserCheck,
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "bg-white/20",
  },
  {
    key: "todaysAppointments",
    label: "Today's Consultations",
    icon: FiCalendar,
    gradient: "from-sky-500 to-cyan-600",
    iconBg: "bg-white/20",
  },
  {
    key: "upcomingConsultations",
    label: "Upcoming Consultations",
    icon: FiClock,
    gradient: "from-amber-500 to-orange-600",
    iconBg: "bg-white/20",
  },
];

export default function StatsCards({ summary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARD_CONFIG.map((card) => (
        <div
          key={card.key}
          className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${card.gradient} p-5 text-white shadow-card transition-transform hover:-translate-y-0.5 hover:shadow-lg`}
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/85">{card.label}</p>
              <p className="mt-1 text-3xl font-bold">{summary ? summary[card.key] : "-"}</p>
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
          <card.icon className="pointer-events-none absolute -bottom-3 -right-3 h-20 w-20 text-white/10" />
        </div>
      ))}
    </div>
  );
}
