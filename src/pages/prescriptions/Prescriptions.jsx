import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiDownload, FiPrinter, FiEye, FiVideo } from "react-icons/fi";
import prescriptionService from "../../services/prescriptions/prescriptionService";
import consultationService from "../../services/consultations/consultationService";
import patientService from "../../services/patients/patientService";
import doctorService from "../../services/doctors/doctorService";
import { DataTable, StatusBadge, Button, SearchInput, Avatar } from "../../components/ui";
import { formatDate } from "../../utils/helpers";
import { downloadPrescriptionPdf, printPrescriptionPdf } from "../../utils/pdfGenerator";


export default function Prescriptions() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [patientMap, setPatientMap] = useState({});
  const [doctorMap, setDoctorMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [consultations, patients, { doctors }] = await Promise.all([
        consultationService.getConsultations(),
        patientService.getPatients(),
        doctorService.getDoctors({ limit: 200 }),
      ]);

      const pMap = Object.fromEntries(patients.map((p) => [p.id, p]));
      const dMap = Object.fromEntries(doctors.map((d) => [d.id, d]));
      setPatientMap(pMap);
      setDoctorMap(dMap);

      const results = await Promise.allSettled(
        consultations.map((c) => prescriptionService.getByConsultation(c.id))
      );

      const consultationMap = Object.fromEntries(consultations.map((c) => [c.id, c]));
      const list = results
        .map((res) => (res.status === "fulfilled" ? res.value : null))
        .filter(Boolean)
        .map((presc) => ({
          ...presc,
          consultationDate: consultationMap[presc.consultationId]?.date,
          patientName: pMap[presc.patientId]?.name || "Unknown Patient",
          doctorName: dMap[presc.doctorId]?.name || "Unknown Doctor",
        }));

      setRows(list);
    } catch (err) {
      toast.error(err.message || "Failed to load prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.patientName.toLowerCase().includes(q) ||
        r.doctorName.toLowerCase().includes(q) ||
        String(r.id).includes(q)
    );
  }, [rows, search]);

  const handleDownload = (row) => {
    downloadPrescriptionPdf(row, { patient: patientMap[row.patientId], doctor: doctorMap[row.doctorId] });
  };

  const handlePrint = (row) => {
    printPrescriptionPdf(row, { patient: patientMap[row.patientId], doctor: doctorMap[row.doctorId] });
  };

  return (
    <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_8px_24px_rgba(79,70,229,0.08)] sm:p-6">
      <div className="mb-5">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by patient, doctor, or prescription ID"
        />
      </div>

      <DataTable
        loading={loading}
        emptyTitle="No prescriptions yet"
        emptyDescription="Prescriptions created by doctors after a consultation will appear here."
        columns={[
          // { key: "id", header: "Prescription ID", render: (r) => `#${r.id}` },
          {
            key: "patientName",
            header: "Patient",
            render: (r) => (
              <div className="flex items-center gap-3">
                <Avatar name={r.patientName} />
                <button
                  className="cursor-pointer text-left text-sm font-bold text-[#4F46E5] hover:underline"
                  onClick={() => navigate(`/patients/${r.patientId}`)}
                >
                  {r.patientName}
                </button>
              </div>
            ),
          },
          { key: "doctorName", header: "Doctor" },
          { key: "consultationDate", header: "Date", render: (r) => formatDate(r.consultationDate) },
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
                  onClick={() => handleDownload(row)}
                >
                  Download
                </Button>
                <Button
                  variant="outlineIndigo"
                  size="sm"
                  icon={FiPrinter}
                  onClick={() => handlePrint(row)}
                >
                  Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={FiVideo}
                  onClick={() => navigate(`/consultations/${row.consultationId}`)}
                >
                  Open Consultation
                </Button>
              </div>
            ),
          },
        ]}
        rows={filtered}
      />
    </div>
  );
}