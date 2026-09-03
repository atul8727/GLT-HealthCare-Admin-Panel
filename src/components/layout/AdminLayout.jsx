import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/patients": "Patients",
  "/doctors": "Doctors",
  "/appointments": "Appointments",
  "/consultations": "Consultations",
  "/medical-records": "Medical Records",
  "/prescriptions": "Prescriptions",
  "/users": "Staff & Users",
  "/settings": "Settings",
};

function resolveTitle(pathname) {
  const match = Object.keys(PAGE_TITLES).find((path) => pathname.startsWith(path));
  return match ? PAGE_TITLES[match] : "GLT Healthcare";
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onToggleSidebar={() => setCollapsed((v) => !v)}
          onToggleMobileSidebar={() => setMobileOpen((v) => !v)}
          pageTitle={resolveTitle(location.pathname)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
