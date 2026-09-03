import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiVideo,
  FiClipboard,
  FiFileText,
  FiUserPlus,
  FiSettings,
} from "react-icons/fi";
import { classNames } from "../../utils/helpers";

const NAV_GROUPS = [
  {
    label: null,
    items: [{ to: "/dashboard", label: "Dashboard", icon: FiHome }],
  },
  {
    label: "Patient Management",
    items: [{ to: "/patients", label: "Patients", icon: FiUsers }],
  },
  {
    label: "Clinic Management",
    items: [
      { to: "/doctors", label: "Doctors", icon: FiUserCheck },
      { to: "/appointments", label: "Appointments", icon: FiCalendar },
      { to: "/consultations", label: "Consultations", icon: FiVideo },
    ],
  },
  {
    label: "Records",
    items: [
      { to: "/medical-records", label: "Medical Records", icon: FiClipboard },
      { to: "/prescriptions", label: "Prescriptions", icon: FiFileText },
    ],
  },
  {
    label: "Administration",
    items: [
      { to: "/users", label: "Staff & Users", icon: FiUserPlus },
      { to: "/settings", label: "Settings", icon: FiSettings },
    ],
  },
];

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const content = (
    <div className="flex h-full flex-col bg-navy text-slate-300">
      <div className="flex h-16 shrink-0 items-center gap-2 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
          G
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold tracking-wide text-white">GLT Healthcare</span>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx}>
            {group.label && !collapsed && (
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    classNames(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    )
                  }
                >
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop / tablet sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden shrink-0 md:block"
      >
        {content}
      </motion.aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-navy/50" onClick={onCloseMobile} />
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-y-0 left-0 w-64"
          >
            {content}
          </motion.div>
        </div>
      )}
    </>
  );
}
