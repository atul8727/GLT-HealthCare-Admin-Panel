import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import doctorService from "../../services/doctors/doctorService";
import { Card, Input, Button, Loader } from "../../components/ui";
import { FiEdit } from "react-icons/fi";

export default function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    doctorService
      .getDoctorById(id)
      .then((data) => setForm(data))
      .catch((err) => toast.error(err.message || "Failed to load doctor."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await doctorService.updateDoctor(id, form);
      toast.success("Doctor updated");
      navigate("/doctors");
    } catch (err) {
      toast.error(err.message || "Failed to update doctor.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading doctor..." />;
  if (!form) return <p className="text-text-secondary">Doctor not found.</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <Card title={`Edit ${form.name}`} icon={FiEdit}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Doctor Name" required value={form.name} onChange={handleChange("name")} />
            <Input
              label="Specialization"
              required
              value={form.specialization}
              onChange={handleChange("specialization")}
            />
            {/* Email can't be changed via this endpoint — shown read-only for reference. */}
            <Input label="Email" type="email" value={form.email} disabled />
            <Input label="Mobile" required value={form.mobile} onChange={handleChange("mobile")} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate("/doctors")}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}