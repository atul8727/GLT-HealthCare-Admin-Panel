import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEdit2, FiArrowLeft } from "react-icons/fi";
import patientService from "../../services/patients/patientService";
import appointmentService from "../../services/appointments/appointmentService";
import prescriptionService from "../../services/prescriptions/prescriptionService";
import { Card, Tabs, Button, DataTable, StatusBadge, Loader } from "../../components/ui";
import VitalsPanel from "../../components/patients/VitalsPanel";
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

  const load = async () => {
    setLoading(true);
    try {
      const [patientData, allAppointments, allPrescriptions] = await Promise.all([
        patientService.getPatientById(id),
        appointmentService.getAppointments(),
        prescriptionService.getPrescriptions(),
      ]);
      setPatient(patientData);
      setAppointments(allAppointments.filter((a) => a.patientId === id));
      setPrescriptions(allPrescriptions.filter((p) => p.patientId === id));
    } catch (err) {
      toast.error(err.message || "Failed to load patient.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
              #{patient.id} · {patient.mobile}
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
                ["Registered By", patient.registeredBy ?? "-"],
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

          {activeTab === "vitals" && <VitalsPanel patientId={id} />}

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