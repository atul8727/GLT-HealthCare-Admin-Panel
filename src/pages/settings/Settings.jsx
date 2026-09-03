import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import settingsService from "../../services/settings/settingsService";
import { Card, Input, Button, Tabs } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";

const TABS = [
  { key: "clinic", label: "Clinic Profile" },
  { key: "account", label: "Account" },
  { key: "password", label: "Password" },
];

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("clinic");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });

  useEffect(() => {
    settingsService.getSettings().then(setForm);
  }, []);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSaveClinic = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.updateSettings(form);
      toast.success("Clinic profile updated");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    toast.success("Password updated (demo only — not persisted)");
    setPasswordForm({ current: "", next: "", confirm: "" });
  };

  if (!form) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <Card bodyClassName="p-0">
        <div className="px-5 pt-2">
          <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-5">
          {activeTab === "clinic" && (
            <form onSubmit={handleSaveClinic} className="space-y-4">
              <Input label="Clinic Name" value={form.clinicName} onChange={handleChange("clinicName")} />
              <Input label="Address" value={form.address} onChange={handleChange("address")} />
              <Input label="Phone" value={form.phone} onChange={handleChange("phone")} />
              <Input label="Email" type="email" value={form.email} onChange={handleChange("email")} />
              <Input label="Website" value={form.website} onChange={handleChange("website")} />
              <div className="flex justify-end pt-2">
                <Button type="submit" loading={saving}>
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {activeTab === "account" && (
            <div className="space-y-4">
              <Input label="Name" value={user?.name || ""} disabled />
              <Input label="Email" value={user?.email || ""} disabled />
              <Input label="Role" value={user?.role || ""} disabled />
              <p className="text-xs text-text-muted">
                Account editing will be enabled once the backend is connected.
              </p>
            </div>
          )}

          {activeTab === "password" && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                required
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
              />
              <Input
                label="New Password"
                type="password"
                required
                value={passwordForm.next}
                onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
              />
              <Input
                label="Confirm New Password"
                type="password"
                required
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              />
              <div className="flex justify-end pt-2">
                <Button type="submit">Change Password</Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
