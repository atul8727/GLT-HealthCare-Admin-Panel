import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiUsers } from "react-icons/fi";
import dashboardService from "../../services/dashboard/dashboardService";
import StatsCards from "../../components/dashboard/StatsCards";
import Card from "../../components/ui/Card";
import { DataTable, StatusBadge } from "../../components/ui";
import { formatDate } from "../../utils/helpers";
import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    dashboardService.getSummary().then((data) => {
      if (mounted) {
        setSummary(data);
        setLoading(false);
      }
    });
    return () => (mounted = false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-navy via-primary to-secondary p-6 text-white shadow-card">
        <h2 className="text-xl font-semibold">Welcome back, {user?.name || "Admin"} 👋</h2>
        <p className="mt-1 text-sm text-white/80">
          Here's what's happening at GLT Healthcare today.
        </p>
      </div>

      <StatsCards summary={summary} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Today's Consultations" icon={FiCalendar}>
          <DataTable
            loading={loading}
            emptyTitle="No consultations today"
            columns={[
              { key: "patientName", header: "Patient" },
              { key: "doctorName", header: "Doctor" },
              { key: "time", header: "Time" },
              {
                key: "status",
                header: "Status",
                render: (row) => <StatusBadge status={row.status} />,
              },
            ]}
            rows={summary?.todaysAppointmentsList || []}
          />
        </Card>

        <Card
          title="Recent Patients"
          icon={FiUsers}
          action={
            <Link to="/patients" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          }
        >
          <DataTable
            loading={loading}
            emptyTitle="No patients yet"
            columns={[
              { key: "name", header: "Name" },
              { key: "mobile", header: "Mobile" },
              {
                key: "createdAt",
                header: "Registered",
                render: (row) => formatDate(row.createdAt),
              },
            ]}
            rows={summary?.recentPatients || []}
          />
        </Card>
      </div>
    </div>
  );
}
