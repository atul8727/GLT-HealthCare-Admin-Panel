import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import consultationService from "../../services/consultations/consultationService";
import patientService from "../../services/patients/patientService";
import doctorService from "../../services/doctors/doctorService";
import {
  DataTable,
  Button,
  SearchInput,
  StatusBadge,
  Tabs,
  Modal,
  ConfirmDialog,
  Input,
  Select,
} from "../../components/ui";
import { formatDate } from "../../utils/helpers";

const TABS = [
  { key: "All", label: "All" },
  { key: "Scheduled", label: "Upcoming" },
  { key: "Today", label: "Today's" },
  { key: "Completed", label: "Completed" },
  { key: "Cancelled", label: "Cancelled" },
];

export default function Consultations() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [patientMap, setPatientMap] = useState({});
  const [doctorMap, setDoctorMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Scheduled");
  const [search, setSearch] = useState("");

  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState(null);
  const [rescheduling, setRescheduling] = useState(false);

  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [consultationData, patients, { doctors }] = await Promise.all([
        consultationService.getConsultations(),
        patientService.getPatients(),
        doctorService.getDoctors({ limit: 200 }),
      ]);
      setConsultations(consultationData);
      setPatientMap(Object.fromEntries(patients.map((p) => [p.id, p.name])));
      setDoctorMap(Object.fromEntries(doctors.map((d) => [d.id, d.name])));
    } catch (err) {
      toast.error(err.message || "Failed to load consultations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const enriched = useMemo(
    () =>
      consultations.map((c) => ({
        ...c,
        patientName: patientMap[c.patientId] || `#${c.patientId}`,
        doctorName: doctorMap[c.doctorId] || `#${c.doctorId}`,
      })),
    [consultations, patientMap, doctorMap]
  );

  const filtered = useMemo(() => {
    let rows = enriched;
    if (activeTab === "Today") rows = rows.filter((c) => c.date === today);
    else if (activeTab !== "All") rows = rows.filter((c) => c.status === activeTab);

    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (c) =>
          c.patientName.toLowerCase().includes(q) || c.doctorName.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [enriched, activeTab, today, search]);

  const openReschedule = (row) => {
    setRescheduleTarget(row);
    setRescheduleForm({
      patientId: row.patientId,
      doctorId: row.doctorId,
      date: row.date,
      time: row.time,
      type: row.type,
      meetLink: row.meetLink,
    });
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    setRescheduling(true);
    try {
      await consultationService.rescheduleConsultation(rescheduleTarget.id, rescheduleForm);
      toast.success("Consultation rescheduled");
      setRescheduleTarget(null);
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
      await consultationService.cancelConsultation(cancelTarget.id);
      toast.success("Consultation cancelled");
      setCancelTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || "Failed to cancel consultation.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by patient or doctor name"
        />
        <Button icon={FiPlus} onClick={() => navigate("/consultations/create")}>
          Schedule Consultation
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-5 pt-2">
        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      <DataTable
        loading={loading}
        emptyTitle="No consultations in this view"
        columns={[
          {
            key: "patientName",
            header: "Patient",
            render: (r) => (
              <button
                className="text-sm font-medium text-primary hover:underline"
                onClick={() => navigate(`/consultations/${r.id}`)}
              >
                {r.patientName}
              </button>
            ),
          },
          { key: "doctorName", header: "Doctor" },
          { key: "date", header: "Date", render: (r) => formatDate(r.date) },
          { key: "time", header: "Time" },
          { key: "type", header: "Type" },
          { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
          {
            key: "actions",
            header: "Actions",
            render: (row) => (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="text-sm font-medium text-primary hover:underline"
                  onClick={() => navigate(`/consultations/${row.id}`)}
                >
                  View Details
                </button>
                {row.status === "Scheduled" && (
                  <>
                    <button
                      className="text-sm font-medium text-text-secondary hover:underline"
                      onClick={() => openReschedule(row)}
                    >
                      Reschedule
                    </button>
                    <button
                      className="text-sm font-medium text-danger hover:underline"
                      onClick={() => setCancelTarget(row)}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            ),
          },
        ]}
        rows={filtered}
      />

      {/* Reschedule — PUT /api/consultations/:id/schedule, only while Scheduled */}
      <Modal
        isOpen={Boolean(rescheduleTarget)}
        onClose={() => setRescheduleTarget(null)}
        title={`Reschedule — ${rescheduleTarget?.patientName || ""}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setRescheduleTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" form="reschedule-consultation" loading={rescheduling}>
              Save
            </Button>
          </>
        }
      >
        {rescheduleForm && (
          <form
            id="reschedule-consultation"
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
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        loading={cancelling}
        title="Cancel consultation"
        confirmLabel="Cancel Consultation"
        message={`Are you sure you want to cancel ${cancelTarget?.patientName}'s consultation on ${formatDate(
          cancelTarget?.date
        )}?`}
      />
    </div>
  );
}