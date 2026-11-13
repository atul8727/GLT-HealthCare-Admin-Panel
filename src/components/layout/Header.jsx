import { useState } from "react";
import { FiMenu, FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ConfirmDialog from "../ui/ConfirmDialog";
import { getInitials } from "../../utils/helpers";

const ICON_BTN =
  "cursor-pointer rounded-xl p-2 text-slate-500 transition-colors hover:bg-blue-50 hover:text-[#1D6FE0]";

export default function Header({ onToggleSidebar, onToggleMobileSidebar, pageTitle }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-white px-4 md:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Open menu"
          className={`${ICON_BTN} md:hidden`}
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className={`${ICON_BTN} hidden md:block`}
        >
          <FiMenu className="h-5 w-5" />
        </button>

        <h1 className="truncate text-base font-bold text-[#14142B] md:text-lg">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-transparent px-2 py-1.5 transition-colors hover:border-[#E2E8F0] hover:bg-slate-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1D6FE0] to-[#0EA5E9] text-sm font-bold text-white shadow-[0_4px_10px_rgba(14,165,233,0.3)]">
              {getInitials(user?.name || "Admin")}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-semibold leading-tight text-[#14142B]">{user?.name}</p>
              <p className="text-xs text-[#64748B]">{user?.role}</p>
            </div>
            <FiChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white py-1.5 shadow-card"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
                className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#14142B] transition-colors hover:bg-blue-50 hover:text-[#1D6FE0]"
              >
                <FiUser className="h-4 w-4" /> Profile
              </button>
              <div className="my-1 border-t border-[#E2E8F0]" />
              <button
                onClick={() => setConfirmLogout(true)}
                className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#E11D48] transition-colors hover:bg-rose-50"
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