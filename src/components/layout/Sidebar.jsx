import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiUserCheck,
  FiVideo,
  FiClipboard,
  FiFileText,
  FiUser,
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
];

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const content = (
    <div className="flex h-full flex-col bg-navy text-slate-300">
      {/* Logo Section - Improved with better text logo */}
      <div className="flex h-20 shrink-0 items-center justify-center px-4 border-b border-white/5">
        {!collapsed ? (
          // Expanded view - Show full logo with image
          <div className="flex items-center justify-center w-full">
            <img
              src="/GLT_logo.jpeg"
              alt="GLT Healthcare"
              className="h-14 w-auto object-contain max-w-[180px]"
            />
          </div>
        ) : (
          // Collapsed view - Show only "GLT" text logo
          <div className="flex items-center justify-center w-full">
            <div className="relative">
              <span className="text-2xl font-bold tracking-tight text-white">
                GLT
              </span>
            </div>
          </div>
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
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
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

      {/* Footer with user info - Only show when expanded */}
      {!collapsed && (
        <div className="border-t border-white/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-xs font-medium text-white">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-slate-400 truncate">admin@glt.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop / tablet sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden shrink-0 md:block"
      >
        {content}
      </motion.aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-navy/50" onClick={onCloseMobile} />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-y-0 left-0 w-[280px]"
          >
            {content}
          </motion.div>
        </div>
      )}
    </>
  );
}
