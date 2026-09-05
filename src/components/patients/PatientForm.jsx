import { useState } from "react";
import toast from "react-hot-toast";
import { Input, Select, Button } from "../ui";
import { GENDERS } from "../../utils/constants";

export default function PatientForm({ initialValues, onSubmit, submitLabel = "Create Patient" }) {
  const [form, setForm] = useState(
    initialValues || {
      name: "",
      mobile: "",
      dob: "",
      gender: "",
      address: "",
      email: "",
      emergencyContact: "",
    }
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const validate = () => {
    const next = {};
    if (!form.name?.trim()) next.name = "Patient name is required";
    if (!form.mobile?.trim()) next.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.mobile.trim())) next.mobile = "Enter a valid 10-digit mobile number";
    if (!form.dob) next.dob = "Date of birth is required";
    if (!form.gender) next.gender = "Gender is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit(form);
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Patient Name"
          required
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
          placeholder="e.g. Rahul Kumar"
        />
        <Input
          label="Mobile Number"
          required
          value={form.mobile}
          onChange={handleChange("mobile")}
          error={errors.mobile}
          placeholder="10-digit mobile number"
        />
        <Input
          label="Date of Birth"
          type="date"
          required
          value={form.dob}
          onChange={handleChange("dob")}
          error={errors.dob}
        />
        <Select
          label="Gender"
          required
          value={form.gender}
          onChange={handleChange("gender")}
          error={errors.gender}
          placeholder="Select gender"
          options={GENDERS}
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          placeholder="patient@example.com"
        />
        <Input
          label="Emergency Contact"
          value={form.emergencyContact}
          onChange={handleChange("emergencyContact")}
          placeholder="Alternate contact number"
        />
        <Input
          label="Address"
          className="sm:col-span-2"
          value={form.address}
          onChange={handleChange("address")}
          placeholder="Full address"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}