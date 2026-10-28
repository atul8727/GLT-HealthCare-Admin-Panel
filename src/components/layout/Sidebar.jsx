import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiUserCheck,
  FiVideo,
  FiClipboard,
  FiFileText,
  FiUser,
  FiMail,
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
    label: "Account",
    items: [{ to: "/profile", label: "Profile", icon: FiUser }],
  },
  {
    label: "Enquiries",
    items: [{ to: "/enquiries", label: "Enquiries", icon: FiMail }],
  },
];

function SidebarContent({ collapsed, onCloseMobile }) {
  return (
    <div className="flex h-full flex-col bg-[#0F172A]">
      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center justify-center border-b border-white/10 px-4">
        {!collapsed ? (
          <img
            src="/GLT_logo.jpeg"
            alt="GLT Healthcare"
            className="h-14 w-auto max-w-[180px] rounded-md bg-white object-contain"
          />
        ) : (
          <span className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
            GLT
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx}>
            {group.label && !collapsed && (
              <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {group.label}
              </p>
            )}
            {group.label && collapsed && idx > 0 && (
              <div className="mx-3 mb-3 border-t border-white/10" />
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
                      "flex items-center gap-3 rounded-xl py-2.5 text-sm font-semibold transition-all duration-150",
                      collapsed ? "justify-center px-0" : "px-3",
                      isActive
                        ? "bg-gradient-to-r from-[#1D6FE0] to-[#0EA5E9] text-white shadow-[0_6px_14px_rgba(14,165,233,0.35)]"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Desktop / tablet sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden shrink-0 md:block"
      >
        <SidebarContent collapsed={collapsed} onCloseMobile={undefined} />
      </motion.aside>

      {/* Mobile drawer (always expanded) */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <motion.div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-y-0 left-0 w-[280px] shadow-2xl"
            >
              <SidebarContent collapsed={false} onCloseMobile={onCloseMobile} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}