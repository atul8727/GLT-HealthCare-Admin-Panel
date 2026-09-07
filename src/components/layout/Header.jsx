import { useState } from "react";
import { FiMenu, FiBell, FiChevronDown, FiLogOut, FiUser, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ConfirmDialog from "../ui/ConfirmDialog";
import { getInitials } from "../../utils/helpers";

export default function Header({ onToggleSidebar, onToggleMobileSidebar, pageTitle, showBack = false }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMobileSidebar}
          className="rounded-md p-2 text-text-secondary hover:bg-slate-100 md:hidden"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <button
          onClick={onToggleSidebar}
          className="hidden rounded-md p-2 text-text-secondary hover:bg-slate-100 md:block"
        >
          <FiMenu className="h-5 w-5" />
        </button>

        {showBack && (
          <button
            onClick={() => navigate(-1)}
            title="Go back"
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-text-secondary hover:bg-slate-100 hover:text-primary"
          >
            <FiArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
        )}

        <h1 className="ml-1 text-base font-semibold text-text-primary md:text-lg">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="relative rounded-md p-2 text-text-secondary hover:bg-slate-100">
          <FiBell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-semibold text-white">
              {getInitials(user?.name || "Admin")}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-text-primary">{user?.name}</p>
              <p className="text-xs text-text-secondary">{user?.role}</p>
            </div>
            <FiChevronDown className="hidden h-4 w-4 text-text-secondary md:block" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-card"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-slate-50"
              >
                <FiUser className="h-4 w-4" /> Profile
              </button>
              <button
                onClick={() => setConfirmLogout(true)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-red-50"
              >
                <FiLogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
        title="Log out"
        message="Are you sure you want to log out of GLT Healthcare Admin Panel?"
        confirmLabel="Logout"
      />
    </header>
  );
}
