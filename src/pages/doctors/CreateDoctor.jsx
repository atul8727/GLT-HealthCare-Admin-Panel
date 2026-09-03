import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import doctorService from "../../services/doctors/doctorService";
import { Card, Input, Button } from "../../components/ui";

const EMPTY = {
  name: "",
  specialization: "",
  qualification: "",
  mobile: "",
  email: "",
  registrationNumber: "",
  experience: "",
  consultationFee: "",
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
      const doctor = await doctorService.createDoctor({ ...form, status: "Active" });
      toast.success(`Doctor added — ${doctor.id}`);
      navigate("/doctors");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card title="Add Doctor">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Doctor Name" required value={form.name} onChange={handleChange("name")} />
            <Input
              label="Specialization"
              required
              value={form.specialization}
              onChange={handleChange("specialization")}
            />
            <Input
              label="Qualification"
              value={form.qualification}
              onChange={handleChange("qualification")}
            />
            <Input label="Mobile" required value={form.mobile} onChange={handleChange("mobile")} />
            <Input label="Email" type="email" value={form.email} onChange={handleChange("email")} />
            <Input
              label="Registration Number"
              value={form.registrationNumber}
              onChange={handleChange("registrationNumber")}
            />
            <Input label="Experience" value={form.experience} onChange={handleChange("experience")} />
            <Input
              label="Consultation Fee"
              value={form.consultationFee}
              onChange={handleChange("consultationFee")}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" loading={saving}>
              Create Doctor
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
