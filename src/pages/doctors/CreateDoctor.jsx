import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import doctorService from "../../services/doctors/doctorService";
import { Card, Input, Button } from "../../components/ui";
import { FiUserPlus } from "react-icons/fi";

const EMPTY = {
  name: "",
  email: "",
  password: "",
  mobile: "",
  specialization: "",
};

export default function CreateDoctor() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const doctor = await doctorService.createDoctor(form);
      toast.success(`Doctor added — ${doctor.name}`);
      navigate("/doctors");
    } catch (err) {
      toast.error(err.message || "Failed to create doctor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Card title="Add Doctor" icon={FiUserPlus}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label="Doctor Name" required value={form.name} onChange={handleChange("name")} />
            <Input
              label="Specialization"
              required
              value={form.specialization}
              onChange={handleChange("specialization")}
            />
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={handleChange("email")}
            />
            <Input label="Mobile" required value={form.mobile} onChange={handleChange("mobile")} />
            <Input
              label="Password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange("password")}
            />
          </div>
          <div className="flex justify-end border-t border-[#E2E8F0] pt-5">
            <Button type="submit" loading={saving}>
              Create Doctor
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}