import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEdit2, FiEye, FiDownload } from "react-icons/fi";
import patientService from "../../services/patients/patientService";
import consultationService from "../../services/consultations/consultationService";
import doctorService from "../../services/doctors/doctorService";
import prescriptionService from "../../services/prescriptions/prescriptionService";
import { Card, Tabs, Button, DataTable, StatusBadge, Loader } from "../../components/ui";
import VitalsPanel from "../../components/patients/VitalsPanel";
import { calculateAge, formatDate, getInitials } from "../../utils/helpers";
import { downloadPrescriptionPdf } from "../../utils/pdfGenerator";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "vitals", label: "Vitals" },
  { key: "consultations", label: "Consultations" },
  { key: "prescriptions", label: "Prescriptions" },
];

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctorMap, setDoctorMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Support landing directly on a tab via ?tab=vitals (used right after
  // registering a new patient, to nudge straight into adding vitals).
  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    TABS.some((t) => t.key === initialTab) ? initialTab : "overview"
  );
  const autoOpenVitals = searchParams.get("new") === "1";

  const load = async () => {
    setLoading(true);
    try {
      const [patientData, allConsultations, { doctors }, patientPrescriptions] = await Promise.all([
        patientService.getPatientById(id),
        consultationService.getConsultations(),
        doctorService.getDoctors({ limit: 200 }),
        prescriptionService.getByPatient(id),
      ]);
      const dMap = Object.fromEntries(doctors.map((d) => [d.id, d]));
      setDoctorMap(dMap);
      setPatient(patientData);
      setConsultations(
        allConsultations
          .filter((c) => String(c.patientId) === String(id))
          .map((c) => ({ ...c, doctorName: dMap[c.doctorId]?.name || "-" }))
      );
      setPrescriptions(
        patientPrescriptions.map((p) => ({ ...p, doctorName: dMap[p.doctorId]?.name || "-" }))
      );
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

  // Once the auto-open flag has been consumed, strip it from the URL so a
  // manual refresh later doesn't keep reopening the Add Vitals form.
  useEffect(() => {
    if (autoOpenVitals) {
      const next = new URLSearchParams(searchParams);
      next.delete("new");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loader label="Loading patient profile..." />;
  if (!patient)
    return (
      <p className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center font-medium text-[#64748B] shadow-xs">
        Patient not found.
      </p>
    );

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4F46E5] to-[#6D5BF0] text-lg font-bold text-white shadow-[0_6px_14px_rgba(79,70,229,0.3)]">
              {getInitials(patient.name)}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-extrabold text-[#14142B]">{patient.name}</h2>
              <p className="text-sm text-[#64748B]">{patient.mobile}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={patient.status || "Active"} />
            <Link to={`/patients/${id}/edit`}>
              <Button variant="edit" icon={FiEdit2}>
                Edit Patient
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <Card bodyClassName="p-0">
        <div className="px-6 pt-5">
          <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-6">
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
                <div
                  key={label}
                  className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-[#14142B]">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {activeTab === "vitals" && (
            <VitalsPanel patientId={id} autoOpenCreate={autoOpenVitals} />
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
              rows={consultations}
            />
          )}

          {activeTab === "prescriptions" && (
            <DataTable
              emptyTitle="No prescriptions yet"
              emptyDescription="Prescriptions created by the doctor after a consultation will appear here."
              columns={[
                { key: "id", header: "Prescription ID", render: (r) => `#${r.id}` },
                { key: "createdAt", header: "Date", render: (r) => formatDate(r.createdAt) },
                { key: "doctorName", header: "Doctor" },
                { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
                {
                  key: "actions",
                  header: "Actions",
                  render: (row) => (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="actionView"
                        size="sm"
                        icon={FiEye}
                        onClick={() => navigate(`/prescriptions/${row.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outlineIndigo"
                        size="sm"
                        icon={FiDownload}
                        onClick={() =>
                          downloadPrescriptionPdf(row, { patient, doctor: doctorMap[row.doctorId] })
                        }
                      >
                        Download
                      </Button>
                    </div>
                  ),
                },
              ]}
              rows={prescriptions}
            />
          )}
        </div>
      </Card>
    </div>
  );
}