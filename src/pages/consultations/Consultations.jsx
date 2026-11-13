import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus, FiEye, FiCalendar, FiX } from "react-icons/fi";
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
  Avatar,
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
        patientName: patientMap[c.patientId] || "Unknown Patient",
        doctorName: doctorMap[c.doctorId] || "Unknown Doctor",
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
    <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_8px_24px_rgba(79,70,229,0.08)] sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by patient or doctor name"
          className="flex-1"
        />
        <Button
          icon={FiPlus}
          onClick={() => navigate("/consultations/create")}
          className="shrink-0"
        >
          Schedule Consultation
        </Button>
      </div>

      <div className="mb-5">
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
              <div className="flex items-center gap-3">
                <Avatar name={r.patientName} />
                <button
                  className="cursor-pointer text-left text-sm font-bold text-[#4F46E5] hover:underline"
                  onClick={() => navigate(`/consultations/${r.id}`)}
                >
                  {r.patientName}
                </button>
              </div>
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
              <div className="flex items-center gap-2">
                <Button
                  variant="actionView"
                  size="sm"
                  icon={FiEye}
                  onClick={() => navigate(`/consultations/${row.id}`)}
                >
                  View Details
                </Button>
                {row.status === "Scheduled" && (
                  <>
                    <Button
                      variant="actionEdit"
                      size="sm"
                      icon={FiCalendar}
                      onClick={() => openReschedule(row)}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="actionDelete"
                      size="sm"
                      icon={FiX}
                      onClick={() => setCancelTarget(row)}
                    >
                      Cancel
                    </Button>
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
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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