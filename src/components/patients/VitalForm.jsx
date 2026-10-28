import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Input, Button } from "../ui";

const EMPTY_FORM = {
  bp: "",
  pulse: "",
  temperature: "",
  spo2: "",
  weight: "",
  height: "",
  bmi: "",
};

/**
 * BMI Auto-calculation:
 * - When weight or height changes, BMI auto-calculates
 * - User can manually override BMI if needed
 */
export default function VitalForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Vitals",
}) {
  const [form, setForm] = useState(initialValues || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const bmiTouched = useRef(Boolean(initialValues?.bmi));

  // Auto-calculate BMI when weight or height changes
  useEffect(() => {
    if (bmiTouched.current) return;

    const weight = Number(form.weight);
    const height = Number(form.height);

    if (weight > 0 && height > 0) {
      const meters = height / 100;
      const bmi = Number((weight / (meters * meters)).toFixed(1));
      setForm((f) => (f.bmi === String(bmi) ? f : { ...f, bmi: String(bmi) }));
    } else if (!form.weight || !form.height) {
      setForm((f) => ({ ...f, bmi: "" }));
    }
  }, [form.weight, form.height]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm({ ...form, [field]: value });

    if (field === "bmi") {
      bmiTouched.current = true;
    }

    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validate = () => {
    const next = {};

    if (!form.bp?.trim()) {
      next.bp = "Blood pressure is required (e.g., 120/80)";
    } else if (!/^\d{2,3}\/\d{2,3}$/.test(form.bp.trim())) {
      next.bp = "Enter valid blood pressure (e.g., 120/80)";
    }

    if (!form.pulse) {
      next.pulse = "Pulse rate is required";
    } else if (Number(form.pulse) < 30 || Number(form.pulse) > 200) {
      next.pulse = "Pulse must be between 30-200 bpm";
    }

    if (!form.temperature) {
      next.temperature = "Temperature is required";
    } else if (Number(form.temperature) < 90 || Number(form.temperature) > 110) {
      next.temperature = "Temperature must be between 90-110°F";
    }

    if (form.spo2 && (Number(form.spo2) < 70 || Number(form.spo2) > 100)) {
      next.spo2 = "SpO2 must be between 70-100%";
    }

    if (form.weight && Number(form.weight) < 2) {
      next.weight = "Weight must be at least 2 kg";
    }

    if (form.height && Number(form.height) < 30) {
      next.height = "Height must be at least 30 cm";
    }

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="Blood Pressure"
          required
          placeholder="e.g. 120/80"
          value={form.bp}
          onChange={handleChange("bp")}
          error={errors.bp}
        />

        <Input
          label="Pulse Rate (bpm)"
          required
          type="number"
          placeholder="e.g. 72"
          value={form.pulse}
          onChange={handleChange("pulse")}
          error={errors.pulse}
          min={30}
          max={200}
        />

        <Input
          label="Temperature (°F)"
          required
          type="number"
          step="0.1"
          placeholder="e.g. 98.6"
          value={form.temperature}
          onChange={handleChange("temperature")}
          error={errors.temperature}
          min={90}
          max={110}
        />

        <Input
          label="SpO₂ (%)"
          type="number"
          placeholder="e.g. 98"
          value={form.spo2}
          onChange={handleChange("spo2")}
          error={errors.spo2}
          min={70}
          max={100}
        />

        <Input
          label="Weight (kg)"
          type="number"
          step="0.1"
          placeholder="e.g. 70.5"
          value={form.weight}
          onChange={handleChange("weight")}
          error={errors.weight}
          min={2}
        />

        <Input
          label="Height (cm)"
          type="number"
          step="0.5"
          placeholder="e.g. 175"
          value={form.height}
          onChange={handleChange("height")}
          error={errors.height}
          min={30}
        />

        <div className="sm:col-span-2 lg:col-span-3">
          <Input
            label="BMI"
            type="number"
            step="0.1"
            value={form.bmi}
            onChange={handleChange("bmi")}
            placeholder="Auto-calculated"
          />
          <p className="mt-1.5 text-xs text-[#64748B]">
            BMI is auto-calculated from weight & height. You can manually edit if needed.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-5">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}