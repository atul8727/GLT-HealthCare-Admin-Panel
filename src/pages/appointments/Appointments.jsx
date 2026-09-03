import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import appointmentService from "../../services/appointments/appointmentService";
import patientService from "../../services/patients/patientService";
import doctorService from "../../services/doctors/doctorService";
import { DataTable, Button, StatusBadge, Modal, Input, Select } from "../../components/ui";
import { formatDate } from "../../utils/helpers";
import { CONSULTATION_TYPES } from "../../utils/constants";

const EMPTY_FORM = {
  patientId: "",
  doctorId: "",
  date: "",
  time: "",
  type: "Online",
  meetLink: "",
  notes: "",
};

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [appts, pts, docs] = await Promise.all([
      appointmentService.getAppointments(),
      patientService.getPatients(),
      doctorService.getDoctors(),
    ]);
    setAppointments(appts.slice().sort((a, b) => (a.date < b.date ? 1 : -1)));
    setPatients(pts);
    setDoctors(docs);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const patient = patients.find((p) => p.id === form.patientId);
      const doctor = doctors.find((d) => d.id === form.doctorId);
      await appointmentService.createAppointment({
        ...form,
        patientName: patient?.name,
        doctorName: doctor?.name,
        status: "Scheduled",
      });
      toast.success("Consultation scheduled");
      setModalOpen(false);
      setForm(EMPTY_FORM);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (appointment) => {
    await appointmentService.cancelAppointment(appointment.id);
    toast.success("Appointment cancelled");
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button icon={FiPlus} onClick={() => setModalOpen(true)}>
          Create Appointment
        </Button>
      </div>

      <DataTable
        loading={loading}
        emptyTitle="No appointments yet"
        emptyDescription="Schedule your first consultation."
        columns={[
          { key: "patientName", header: "Patient" },
          { key: "doctorName", header: "Doctor" },
          { key: "date", header: "Date", render: (r) => formatDate(r.date) },
          { key: "time", header: "Time" },
          { key: "type", header: "Type" },
          { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
          {
            key: "actions",
            header: "Actions",
            render: (r) =>
              r.status === "Scheduled" && (
                <Button variant="ghost" size="sm" onClick={() => handleCancel(r)}>
                  Cancel
                </Button>
              ),
          },
        ]}
        rows={appointments}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Consultation"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} loading={saving}>
              Schedule Consultation
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleCreate}>
          <Select
            label="Patient"
            required
            placeholder="Select patient"
            value={form.patientId}
            onChange={handleChange("patientId")}
            options={patients.map((p) => ({ value: p.id, label: p.name }))}
          />
          <Select
            label="Doctor"
            required
            placeholder="Select doctor"
            value={form.doctorId}
            onChange={handleChange("doctorId")}
            options={doctors.map((d) => ({ value: d.id, label: d.name }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" required value={form.date} onChange={handleChange("date")} />
            <Input label="Time" type="time" required value={form.time} onChange={handleChange("time")} />
          </div>
          <Select
            label="Consultation Type"
            value={form.type}
            onChange={handleChange("type")}
            options={CONSULTATION_TYPES}
          />
          <Input
            label="Google Meet Link"
            value={form.meetLink}
            onChange={handleChange("meetLink")}
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
          />
        </form>
      </Modal>
    </div>
  );
}
