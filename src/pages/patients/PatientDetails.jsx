import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEdit2, FiArrowLeft } from "react-icons/fi";
import patientService from "../../services/patients/patientService";
import appointmentService from "../../services/appointments/appointmentService";
import prescriptionService from "../../services/prescriptions/prescriptionService";
import { Card, Tabs, Button, Input, DataTable, StatusBadge, Loader } from "../../components/ui";
import { calculateAge, formatDate } from "../../utils/helpers";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "vitals", label: "Vitals" },
  { key: "consultations", label: "Consultations" },
  { key: "prescriptions", label: "Prescriptions" },
];

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [vitalsForm, setVitalsForm] = useState({
    bp: "",
    pulse: "",
    temperature: "",
    spo2: "",
    weight: "",
    height: "",
  });
  const [savingVitals, setSavingVitals] = useState(false);

  const load = async () => {
    setLoading(true);
    const [patientData, allAppointments, allPrescriptions] = await Promise.all([
      patientService.getPatientById(id),
      appointmentService.getAppointments(),
      prescriptionService.getPrescriptions(),
    ]);
    setPatient(patientData);
    setAppointments(allAppointments.filter((a) => a.patientId === id));
    setPrescriptions(allPrescriptions.filter((p) => p.patientId === id));
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddVitals = async (e) => {
    e.preventDefault();
    setSavingVitals(true);
    try {
      await patientService.addVitals(id, vitalsForm);
      toast.success("Vitals saved");
      setVitalsForm({ bp: "", pulse: "", temperature: "", spo2: "", weight: "", height: "" });
      load();
    } finally {
      setSavingVitals(false);
    }
  };

  if (loading) return <Loader label="Loading patient profile..." />;
  if (!patient) return <p className="text-text-secondary">Patient not found.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/patients")}
          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <FiArrowLeft className="h-4 w-4" /> Back to Patients
        </button>
        <Link to={`/patients/${id}/edit`}>
          <Button variant="outline" icon={FiEdit2}>
            Edit Patient
          </Button>
        </Link>
      </div>

      <Card>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">{patient.name}</h2>
            <p className="text-sm text-text-secondary">
              {patient.id} · {patient.mobile}
            </p>
          </div>
          <StatusBadge status={patient.status || "Active"} />
        </div>
      </Card>

      <Card bodyClassName="p-0">
        <div className="px-5 pt-2">
          <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-5">
          {activeTab === "overview" && (
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ["Name", patient.name],
                ["Age / DOB", `${calculateAge(patient.dob)} yrs (${formatDate(patient.dob)})`],
                ["Gender", patient.gender],
                ["Mobile", patient.mobile],
                ["Email", patient.email || "-"],
                ["Address", patient.address || "-"],
                ["Emergency Contact", patient.emergencyContact || "-"],
                ["Registered On", formatDate(patient.createdAt)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm text-text-primary">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {activeTab === "vitals" && (
            <div className="space-y-6">
              <form onSubmit={handleAddVitals} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Input
                  label="Blood Pressure"
                  placeholder="120/80"
                  value={vitalsForm.bp}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, bp: e.target.value })}
                />
                <Input
                  label="Pulse (bpm)"
                  value={vitalsForm.pulse}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, pulse: e.target.value })}
                />
                <Input
                  label="Temperature (°F)"
                  value={vitalsForm.temperature}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, temperature: e.target.value })}
                />
                <Input
                  label="SpO₂ (%)"
                  value={vitalsForm.spo2}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, spo2: e.target.value })}
                />
                <Input
                  label="Weight (kg)"
                  value={vitalsForm.weight}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, weight: e.target.value })}
                />
                <Input
                  label="Height (cm)"
                  value={vitalsForm.height}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, height: e.target.value })}
                />
                <div className="col-span-2 sm:col-span-3">
                  <Button type="submit" loading={savingVitals}>
                    Save Vitals
                  </Button>
                </div>
              </form>

              <DataTable
                emptyTitle="No vitals recorded yet"
                columns={[
                  { key: "recordedAt", header: "Date", render: (r) => formatDate(r.recordedAt) },
                  { key: "bp", header: "BP" },
                  { key: "pulse", header: "Pulse" },
                  { key: "temperature", header: "Temp" },
                  { key: "spo2", header: "SpO₂" },
                  { key: "weight", header: "Weight" },
                ]}
                rows={(patient.vitalsHistory || []).slice().reverse()}
                rowKey="recordedAt"
              />
            </div>
          )}

          {activeTab === "consultations" && (
            <DataTable
              emptyTitle="No consultations yet"
              columns={[
                { key: "date", header: "Date", render: (r) => formatDate(r.date) },
                { key: "doctorName", header: "Doctor" },
                { key: "type", header: "Type" },
                { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
              ]}
              rows={appointments}
            />
          )}

          {activeTab === "prescriptions" && (
            <DataTable
              emptyTitle="No prescriptions yet"
              columns={[
                { key: "id", header: "Prescription ID" },
                { key: "date", header: "Date", render: (r) => formatDate(r.date) },
                { key: "doctorName", header: "Doctor" },
                { key: "diagnosis", header: "Diagnosis" },
                { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
              ]}
              rows={prescriptions}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
