import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import consultationService from "../../services/consultations/consultationService";
import patientService from "../../services/patients/patientService";
import doctorService from "../../services/doctors/doctorService";
import { Card, Input, Select, Button, Loader } from "../../components/ui";
import { FiVideo } from "react-icons/fi";

const EMPTY = {
  patientId: "",
  doctorId: "",
  date: "",
  time: "",
  type: "Online",
  meetLink: "",
};

export default function CreateConsultation() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([patientService.getPatients(), doctorService.getDoctors({ limit: 200 })])
      .then(([patientList, { doctors: doctorList }]) => {
        setPatients(patientList);
        setDoctors(doctorList);
      })
      .catch((err) => toast.error(err.message || "Failed to load patients/doctors."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await consultationService.createConsultation(form);
      toast.success("Consultation scheduled");
      navigate("/consultations");
    } catch (err) {
      toast.error(err.message || "Failed to schedule consultation.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading patients and doctors..." />;

  return (
    <div className="mx-auto max-w-2xl">
      <Card title="Schedule Consultation" icon={FiVideo}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Patient"
              required
              placeholder="Select patient"
              value={form.patientId}
              onChange={handleChange("patientId")}
              options={patients.map((p) => ({ value: p.id, label: `${p.name} — ${p.mobile}` }))}
            />
            <Select
              label="Doctor"
              required
              placeholder="Select doctor"
              value={form.doctorId}
              onChange={handleChange("doctorId")}
              options={doctors.map((d) => ({
                value: d.id,
                label: `${d.name} — ${d.specialization}`,
              }))}
            />
            <Input label="Date" type="date" required value={form.date} onChange={handleChange("date")} />
            <Input label="Time" type="time" required value={form.time} onChange={handleChange("time")} />
            <Select
              label="Type"
              required
              value={form.type}
              onChange={handleChange("type")}
              options={[
                { value: "Online", label: "Online" },
                { value: "Offline", label: "Offline" },
              ]}
            />
            {form.type === "Online" && (
              <Input
                label="Meet Link"
                placeholder="https://meet.google.com/..."
                value={form.meetLink}
                onChange={handleChange("meetLink")}
              />
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate("/consultations")}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Schedule Consultation
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}