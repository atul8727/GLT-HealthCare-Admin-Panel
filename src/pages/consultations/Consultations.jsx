import { useEffect, useMemo, useState } from "react";
import appointmentService from "../../services/appointments/appointmentService";
import { DataTable, StatusBadge, Tabs } from "../../components/ui";
import { formatDate } from "../../utils/helpers";

const TABS = [
  { key: "Scheduled", label: "Upcoming" },
  { key: "Today", label: "Today's" },
  { key: "Completed", label: "Completed" },
  { key: "Cancelled", label: "Cancelled" },
];

export default function Consultations() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Scheduled");

  useEffect(() => {
    appointmentService.getAppointments().then((data) => {
      setAppointments(data);
      setLoading(false);
    });
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const filtered = useMemo(() => {
    if (activeTab === "Today") return appointments.filter((a) => a.date === today);
    return appointments.filter((a) => a.status === activeTab);
  }, [appointments, activeTab, today]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white px-5 pt-2">
        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      <DataTable
        loading={loading}
        emptyTitle="No consultations in this view"
        columns={[
          { key: "patientName", header: "Patient" },
          { key: "doctorName", header: "Doctor" },
          { key: "date", header: "Date", render: (r) => formatDate(r.date) },
          { key: "time", header: "Time" },
          { key: "type", header: "Type" },
          { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={filtered}
      />
    </div>
  );
}
