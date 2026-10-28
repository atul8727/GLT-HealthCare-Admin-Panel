import { FiUsers, FiUserCheck, FiCalendar, FiClock } from "react-icons/fi";

const CARD_CONFIG = [
  {
    key: "totalPatients",
    label: "Total Patients",
    icon: FiUsers,
    gradient: "from-[#3B6CF5] via-[#4F5FEA] to-[#6D4FE0]",
    shadow: "shadow-[0_12px_28px_rgba(79,95,234,0.35)] hover:shadow-[0_16px_34px_rgba(79,95,234,0.45)]",
  },
  {
    key: "totalDoctors",
    label: "Total Doctors",
    icon: FiUserCheck,
    gradient: "from-[#10B981] via-[#0FA77D] to-[#0B8F73]",
    shadow: "shadow-[0_12px_28px_rgba(16,185,129,0.32)] hover:shadow-[0_16px_34px_rgba(16,185,129,0.42)]",
  },
  {
    key: "todaysAppointments",
    label: "Today's Consultations",
    icon: FiCalendar,
    gradient: "from-[#0EA5E9] via-[#0A93CF] to-[#0877B5]",
    shadow: "shadow-[0_12px_28px_rgba(14,165,233,0.32)] hover:shadow-[0_16px_34px_rgba(14,165,233,0.42)]",
  },
  {
    key: "upcomingConsultations",
    label: "Upcoming Consultations",
    icon: FiClock,
    gradient: "from-[#FBA919] via-[#F58A0B] to-[#EA580C]",
    shadow: "shadow-[0_12px_28px_rgba(245,138,11,0.34)] hover:shadow-[0_16px_34px_rgba(245,138,11,0.44)]",
  },
];

export default function StatsCards({ summary }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {CARD_CONFIG.map((card) => (
        <div
          key={card.key}
          className={`group relative overflow-hidden rounded-[22px] bg-gradient-to-br ${card.gradient} ${card.shadow} p-5 text-white ring-1 ring-inset ring-white/20 transition-all duration-300 hover:-translate-y-1`}
        >
          {/* soft decorative shapes */}
          <span className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-110" />
          <span className="pointer-events-none absolute -bottom-14 right-14 h-32 w-32 rounded-full bg-white/[0.07]" />
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-wide text-white/90">
                {card.label}
              </p>
              <p className="mt-3 text-4xl font-extrabold leading-none tracking-tight drop-shadow-sm">
                {summary ? summary[card.key] : "-"}
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-inner ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <card.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}