import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiDownload, FiPrinter, FiFileText } from "react-icons/fi";
import consultationService from "../../services/consultations/consultationService";
import patientService from "../../services/patients/patientService";
import doctorService from "../../services/doctors/doctorService";
import prescriptionService from "../../services/prescriptions/prescriptionService";
import { Card, Button, StatusBadge, Loader, Modal, ConfirmDialog, Input, Select } from "../../components/ui";
import { formatDate } from "../../utils/helpers";
import { downloadPrescriptionPdf, printPrescriptionPdf } from "../../utils/pdfGenerator";

export default function ConsultationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rescheduleForm, setRescheduleForm] = useState(null);
  const [rescheduling, setRescheduling] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await consultationService.getConsultationById(id);
      setConsultation(data);
      const [p, d, presc] = await Promise.all([
        patientService.getPatientById(data.patientId).catch(() => null),
        doctorService.getDoctorById(data.doctorId).catch(() => null),
        prescriptionService.getByConsultation(id).catch(() => null),
      ]);
      setPatient(p);
      setDoctor(d);
      setPrescription(presc);
    } catch (err) {
      toast.error(err.message || "Failed to load consultation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const openReschedule = () => {
    setRescheduleForm({
      patientId: consultation.patientId,
      doctorId: consultation.doctorId,
      date: consultation.date,
      time: consultation.time,
      type: consultation.type,
      meetLink: consultation.meetLink,
    });
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    setRescheduling(true);
    try {
      await consultationService.rescheduleConsultation(id, rescheduleForm);
      toast.success("Consultation rescheduled");
      setRescheduleForm(null);
      load();
    } catch (err) {
      toast.error(err.message || "Failed to reschedule consultation.");
    } finally {
      setRescheduling(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await consultationService.cancelConsultation(id);
      toast.success("Consultation cancelled");
      setShowCancel(false);
      load();
    } catch (err) {
      toast.error(err.message || "Failed to cancel consultation.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Loader label="Loading consultation..." />;
  if (!consultation) return <p className="text-text-secondary">Consultation not found.</p>;

  const isScheduled = consultation.status === "Scheduled";

  return (
    <div className="space-y-4">
      {isScheduled && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={openReschedule}>
            Reschedule
          </Button>
          <Button variant="danger" onClick={() => setShowCancel(true)}>
            Cancel Consultation
          </Button>
        </div>
      )}

      <Card>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              {patient?.name || "Patient"}
            </h2>
            <p className="text-sm text-text-secondary">
              with {doctor?.name || "Doctor"}
              {doctor?.specialization ? ` · ${doctor.specialization}` : ""}
            </p>
          </div>
          <StatusBadge status={consultation.status} />
        </div>
      </Card>

      <Card title="Consultation Info">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
  ["Date", formatDate(consultation.date)],
  ["Time", consultation.time],
  ["Type", consultation.type],
  [
    "Meet Link",
    consultation.meetLink ? (
      <a
        key="meet-link"
        href={consultation.meetLink}
        target="_blank"
        rel="noreferrer"
        className="text-primary hover:underline"
      >
        {consultation.meetLink}
      </a>
    ) : (
      "-"
    ),
  ],
  ["Patient Mobile", patient?.mobile || "-"],
  ["Doctor Mobile", doctor?.mobile || "-"],
  ["Created At", formatDate(consultation.createdAt)],
  ["Last Updated", formatDate(consultation.updatedAt)],
].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</dt>
              <dd className="mt-1 text-sm text-text-primary">{value ?? "-"}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* Clinical details are filled in by the doctor after the consultation
          (separate doctor-side workflow) — shown here read-only for reference. */}
      <Card title="Clinical Notes (filled by doctor)">
        {!consultation.diagnosis && !consultation.chiefComplaint ? (
          <p className="text-sm text-text-secondary">
            Not filled in yet — this is completed by the doctor after the consultation.
          </p>
        ) : (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              ["Chief Complaint", consultation.chiefComplaint],
              ["Medical History", consultation.medicalHistory],
              ["Examination Notes", consultation.examinationNotes],
              ["Diagnosis", consultation.diagnosis],
              ["Consultation Notes", consultation.consultationNotes],
              ["Advice", consultation.advice],
              ["Follow-up Recommendation", consultation.followUpRecommendation],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</dt>
                <dd className="mt-1 text-sm text-text-primary">{value || "-"}</dd>
              </div>
            ))}
          </dl>
        )}
      </Card>

      {/* Prescription is created by the doctor (Doctor Panel), not here —
          same read-only convention as Clinical Notes above. Admin can only
          view / download / print once it exists. */}
      <Card
        title="Prescription"
        icon={FiFileText}
        action={
          prescription && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={FiPrinter}
                onClick={() => printPrescriptionPdf(prescription, { patient, doctor })}
              >
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={FiDownload}
                onClick={() => downloadPrescriptionPdf(prescription, { patient, doctor })}
              >
                Download
              </Button>
            </div>
          )
        }
      >
        {!prescription ? (
          <p className="text-sm text-text-secondary">
            No prescription yet — this is created by the doctor after the consultation.
          </p>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Prescription #{prescription.id} · {prescription.medicines.length}{" "}
                {prescription.medicines.length === 1 ? "medicine" : "medicines"}
              </p>
              <p className="mt-0.5 text-xs text-text-secondary">
                Issued {formatDate(prescription.createdAt)}
                {prescription.followUpDate ? ` · Follow-up ${formatDate(prescription.followUpDate)}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={prescription.status} />
              <button
                className="text-sm font-medium text-primary hover:underline"
                onClick={() => navigate(`/prescriptions/${prescription.id}`)}
              >
                View Full Prescription
              </button>
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={Boolean(rescheduleForm)}
        onClose={() => setRescheduleForm(null)}
        title="Reschedule Consultation"
        footer={
          <>
            <Button variant="outline" onClick={() => setRescheduleForm(null)}>
              Cancel
            </Button>
            <Button type="submit" form="reschedule-consultation-details" loading={rescheduling}>
              Save
            </Button>
          </>
        }
      >
        {rescheduleForm && (
          <form
            id="reschedule-consultation-details"
            onSubmit={handleRescheduleSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Date"
                type="date"
                required
                value={rescheduleForm.date}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
              />
              <Input
                label="Time"
                type="time"
                required
                value={rescheduleForm.time}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
              />
              <Select
                label="Type"
                required
                value={rescheduleForm.type}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, type: e.target.value })}
                options={[
                  { value: "Online", label: "Online" },
                  { value: "Offline", label: "Offline" },
                ]}
              />
              {rescheduleForm.type === "Online" && (
                <Input
                  label="Meet Link"
                  value={rescheduleForm.meetLink}
                  onChange={(e) =>
                    setRescheduleForm({ ...rescheduleForm, meetLink: e.target.value })
                  }
                />
              )}
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={handleCancel}
        loading={cancelling}
        title="Cancel consultation"
        confirmLabel="Cancel Consultation"
        message="Are you sure you want to cancel this consultation? This cannot be undone."
      />
    </div>
  );
}