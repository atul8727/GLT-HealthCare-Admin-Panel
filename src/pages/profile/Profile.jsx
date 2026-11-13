import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiMail, FiShield, FiUser } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { Card, Button, ConfirmDialog } from "../../components/ui";
import { getInitials } from "../../utils/helpers";

/**
 * Profile — shows only what actually comes back from the login API
 * (name, email, role). There's no fake "Clinic Profile" or "Change
 * Password" here since neither is backed by a real endpoint yet.
 */
export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Card bodyClassName="p-0" className="overflow-hidden">
        <div className="bg-gradient-to-r from-[#4F46E5] to-[#6D5BF0] px-6 py-8 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl font-bold ring-4 ring-white/30">
              {getInitials(user?.name || "Admin")}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold [overflow-wrap:anywhere]">{user?.name || "Admin"}</h2>
              <p className="text-sm text-white/80 [overflow-wrap:anywhere]">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 sm:p-6">
          <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
              <FiUser className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Name</p>
              <p className="mt-0.5 text-sm font-semibold text-[#14142B] [overflow-wrap:anywhere]">
                {user?.name || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#0EA5E9]">
              <FiMail className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Email</p>
              <p className="mt-0.5 text-sm font-semibold text-[#14142B] [overflow-wrap:anywhere]">
                {user?.email || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#16A34A]">
              <FiShield className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Role</p>
              <p className="mt-0.5 text-sm font-semibold capitalize text-[#14142B]">
                {user?.role || "-"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[#14142B]">Log out</p>
            <p className="mt-0.5 text-sm text-[#64748B]">End your current session on this device.</p>
          </div>
          <Button
            variant="danger"
            icon={FiLogOut}
            className="shrink-0"
            onClick={() => setConfirmLogout(true)}
          >
            Logout
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
        title="Log out"
        message="Are you sure you want to log out of GLT Healthcare Admin Panel?"
        confirmLabel="Logout"
      />
    </div>
  );
}