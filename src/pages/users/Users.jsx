import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import userService from "../../services/users/userService";
import { DataTable, Button, StatusBadge, Modal, Input, Select } from "../../components/ui";
import { ROLES } from "../../utils/constants";

const EMPTY_FORM = { name: "", email: "", role: ROLES.ADMIN };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await userService.getUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.createUser({ ...form, status: "Active" });
      toast.success("User created");
      setModalOpen(false);
      setForm(EMPTY_FORM);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (user) => {
    await userService.updateUser(user.id, {
      status: user.status === "Active" ? "Inactive" : "Active",
    });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button icon={FiPlus} onClick={() => setModalOpen(true)}>
          Add User
        </Button>
      </div>

      <DataTable
        loading={loading}
        emptyTitle="No staff users yet"
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "role", header: "Role" },
          { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
          {
            key: "actions",
            header: "Actions",
            render: (row) => (
              <Button variant="ghost" size="sm" onClick={() => handleToggle(row)}>
                {row.status === "Active" ? "Deactivate" : "Activate"}
              </Button>
            ),
          },
        ]}
        rows={users}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Staff User"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} loading={saving}>
              Create User
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleCreate}>
          <Input
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={Object.values(ROLES)}
          />
        </form>
      </Modal>
    </div>
  );
}
