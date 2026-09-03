import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dashboardService from "../../services/dashboard/dashboardService";
import StatsCards from "../../components/dashboard/StatsCards";
import Card from "../../components/ui/Card";
import { DataTable, StatusBadge } from "../../components/ui";
import { formatDate } from "../../utils/helpers";

export default function Dashboard() {
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
      <StatsCards summary={summary} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Today's Appointments">
          <DataTable
            loading={loading}
            emptyTitle="No appointments today"
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
