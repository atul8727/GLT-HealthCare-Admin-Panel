import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiDownload, FiPrinter, FiArrowLeft, FiVideo } from "react-icons/fi";
import prescriptionService from "../../services/prescriptions/prescriptionService";
import patientService from "../../services/patients/patientService";
import doctorService from "../../services/doctors/doctorService";
import { Card, Button, StatusBadge, Loader } from "../../components/ui";
import { formatDate } from "../../utils/helpers";
import { downloadPrescriptionPdf, printPrescriptionPdf } from "../../utils/pdfGenerator";

const TH =
  "whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.06em] text-[#64748B]";
const TD = "px-5 py-4 align-top text-sm text-[#14142B]";

function InfoTile({ label, children }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap break-words text-sm font-semibold text-[#14142B]">
        {children}
      </dd>
    </div>
  );
}


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
  if (!prescription)
    return (
      <p className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center font-medium text-[#64748B] shadow-xs">
        Prescription not found.
      </p>
    );

  const meta = { patient, doctor };

  return (
    <div className="space-y-5">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" icon={FiArrowLeft} onClick={() => navigate(-1)}>
          Back
        </Button>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outlineIndigo"
            icon={FiPrinter}
            onClick={() => printPrescriptionPdf(prescription, meta)}
          >
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
      <div className="print-area space-y-5">
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-[#4F46E5]">GLT Healthcare</h2>
              <p className="mt-0.5 text-sm font-medium text-[#64748B]">
                Prescription #{prescription.id}
              </p>
            </div>
            <div className="flex flex-col items-start gap-1.5 sm:items-end">
              <StatusBadge status={prescription.status} />
              <p className="text-xs text-[#64748B]">Issued {formatDate(prescription.createdAt)}</p>
            </div>
          </div>
        </Card>

        <Card title="Patient & Doctor">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Patient", patient?.name || "-"],
              ["Patient Mobile", patient?.mobile || "-"],
              ["Age / Gender", `${patient?.age ?? "-"} / ${patient?.gender || "-"}`],
              ["Doctor", doctor?.name ? `Dr. ${doctor.name}` : "-"],
              ["Specialization", doctor?.specialization || "-"],
              ["Doctor Mobile", doctor?.mobile || "-"],
            ].map(([label, value]) => (
              <InfoTile key={label} label={label}>
                {value}
              </InfoTile>
            ))}
          </dl>
          <div className="no-print mt-5 border-t border-[#E2E8F0] pt-4">
            <Link
              to={`/consultations/${prescription.consultationId}`}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-[#4F46E5] shadow-xs transition-colors hover:border-indigo-300 hover:bg-indigo-50"
            >
              <FiVideo className="h-4 w-4" />
              Open Consultation #{prescription.consultationId}
            </Link>
          </div>
        </Card>

        <Card title="Medicines">
          {prescription.medicines.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-8 text-center text-sm text-[#64748B]">
              No medicines listed on this prescription.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white">
              <table className="min-w-full border-collapse">
                <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <tr>
                    {["Medicine", "Dosage", "Frequency", "Duration", "Instructions"].map((h) => (
                      <th key={h} className={TH}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {prescription.medicines.map((med) => (
                    <tr key={med.id} className="transition-colors hover:bg-slate-50/80">
                      <td className={`${TD} font-bold`}>{med.name}</td>
                      <td className={TD}>{med.dosage || "-"}</td>
                      <td className={TD}>{med.frequency || "-"}</td>
                      <td className={TD}>{med.duration || "-"}</td>
                      <td className={`${TD} min-w-[180px]`}>{med.instructions || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="Tests, Advice & Follow-up">
          <dl className="grid grid-cols-1 gap-3">
            <InfoTile label="Tests Recommended">{prescription.testsRecommended || "-"}</InfoTile>
            <InfoTile label="Additional Advice">{prescription.additionalAdvice || "-"}</InfoTile>
            <InfoTile label="Follow-up Date">
              {prescription.followUpDate ? formatDate(prescription.followUpDate) : "-"}
            </InfoTile>
          </dl>
        </Card>
      </div>
    </div>
  );
}