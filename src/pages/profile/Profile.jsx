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
    <div className="mx-auto max-w-2xl space-y-4">
      <Card bodyClassName="p-0" className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-xl font-bold ring-4 ring-white/30">
              {getInitials(user?.name || "Admin")}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name || "Admin"}</h2>
              <p className="text-sm text-white/80">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <div className="flex items-center gap-3 px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary">
              <FiUser className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Name</p>
              <p className="text-sm font-medium text-text-primary">{user?.name || "-"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-info">
              <FiMail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Email</p>
              <p className="text-sm font-medium text-text-primary">{user?.email || "-"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-success">
              <FiShield className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Role</p>
              <p className="text-sm font-medium capitalize text-text-primary">{user?.role || "-"}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">Log out</p>
            <p className="text-sm text-text-secondary">End your current session on this device.</p>
          </div>
          <Button variant="danger" icon={FiLogOut} onClick={() => setConfirmLogout(true)}>
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
