import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiDownload, FiPrinter, FiArrowLeft } from "react-icons/fi";
import prescriptionService from "../../services/prescriptions/prescriptionService";
import patientService from "../../services/patients/patientService";
import doctorService from "../../services/doctors/doctorService";
import { Card, Button, StatusBadge, Loader } from "../../components/ui";
import { formatDate } from "../../utils/helpers";
import { downloadPrescriptionPdf, printPrescriptionPdf } from "../../utils/pdfGenerator";

/**
 * Prescription Details — Route: /prescriptions/:id
 * GET /api/prescriptions/:id, enriched with the patient + doctor records
 * (already fetched elsewhere in the app the same way — see
 * ConsultationDetails.jsx for the identical Promise.all pattern).
 */
export default function PrescriptionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await prescriptionService.getById(id);
        setPrescription(data);
        const [p, d] = await Promise.all([
          patientService.getPatientById(data.patientId).catch(() => null),
          doctorService.getDoctorById(data.doctorId).catch(() => null),
        ]);
        setPatient(p);
        setDoctor(d);
      } catch (err) {
        toast.error(err.message || "Failed to load prescription.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader label="Loading prescription..." />;
  if (!prescription) return <p className="text-text-secondary">Prescription not found.</p>;

  const meta = { patient, doctor };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex gap-2">
          <Button variant="outline" icon={FiPrinter} onClick={() => printPrescriptionPdf(prescription, meta)}>
            Print
          </Button>
          <Button icon={FiDownload} onClick={() => downloadPrescriptionPdf(prescription, meta)}>
            Download PDF
          </Button>
        </div>
      </div>

      {/* Everything inside print-area is what @media print keeps visible —
          see styles/index.css. Printing here is a fallback for browsers
          where the auto-print PDF popup gets blocked. */}
      <div className="print-area space-y-4">
        <Card>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-primary">GLT Healthcare</h2>
              <p className="text-sm text-text-secondary">Prescription #{prescription.id}</p>
            </div>
            <div className="flex flex-col items-start gap-1 sm:items-end">
              <StatusBadge status={prescription.status} />
              <p className="text-xs text-text-muted">
                Issued {formatDate(prescription.createdAt)}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Patient & Doctor">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              ["Patient", patient?.name || "-"],
              ["Patient Mobile", patient?.mobile || "-"],
              ["Age / Gender", `${patient?.age ?? "-"} / ${patient?.gender || "-"}`],
              ["Doctor", doctor?.name ? `Dr. ${doctor.name}` : "-"],
              ["Specialization", doctor?.specialization || "-"],
              ["Doctor Mobile", doctor?.mobile || "-"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</dt>
                <dd className="mt-1 text-sm text-text-primary">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 border-t border-slate-100 pt-3">
            <Link
              to={`/consultations/${prescription.consultationId}`}
              className="text-sm font-medium text-primary hover:underline no-print"
            >
              Open Consultation #{prescription.consultationId}
            </Link>
          </div>
        </Card>

        <Card title="Medicines">
          {prescription.medicines.length === 0 ? (
            <p className="text-sm text-text-secondary">No medicines listed on this prescription.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    {["Medicine", "Dosage", "Frequency", "Duration", "Instructions"].map((h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prescription.medicines.map((med) => (
                    <tr key={med.id}>
                      <td className="px-4 py-2.5 text-sm font-medium text-text-primary">{med.name}</td>
                      <td className="px-4 py-2.5 text-sm text-text-primary">{med.dosage || "-"}</td>
                      <td className="px-4 py-2.5 text-sm text-text-primary">{med.frequency || "-"}</td>
                      <td className="px-4 py-2.5 text-sm text-text-primary">{med.duration || "-"}</td>
                      <td className="px-4 py-2.5 text-sm text-text-primary">{med.instructions || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="Tests, Advice & Follow-up">
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Tests Recommended
              </dt>
              <dd className="mt-1 text-sm text-text-primary">
                {prescription.testsRecommended || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Additional Advice
              </dt>
              <dd className="mt-1 text-sm text-text-primary">
                {prescription.additionalAdvice || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Follow-up Date
              </dt>
              <dd className="mt-1 text-sm text-text-primary">
                {prescription.followUpDate ? formatDate(prescription.followUpDate) : "-"}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}