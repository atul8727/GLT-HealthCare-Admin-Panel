import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Sidebar from "./Sidebar";
import Header from "./Header";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/patients": "Patients",
  "/doctors": "Doctors",
  "/consultations": "Consultations",
  "/medical-records": "Medical Records",
  "/prescriptions": "Prescriptions",
  "/enquiries": "Enquiries",
  "/profile": "Profile",
};

function resolveTitle(pathname) {
  const match = Object.keys(PAGE_TITLES).find((path) => pathname.startsWith(path));
  return match ? PAGE_TITLES[match] : "GLT Healthcare";
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname !== "/dashboard";

  return (
    <div className="flex h-screen w-full overflow-hidden">
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
          {showBack && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              title="Go back"
              className="mb-4 flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-sm font-semibold text-[#1D6FE0] shadow-xs transition-colors hover:border-blue-200 hover:bg-blue-50"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}