import { useEffect, useState } from "react";
import prescriptionService from "../../services/prescriptions/prescriptionService";
import { DataTable, StatusBadge, Button } from "../../components/ui";
import { formatDate } from "../../utils/helpers";
import toast from "react-hot-toast";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    prescriptionService.getPrescriptions().then((data) => {
      setPrescriptions(data);
      setLoading(false);
    });
  }, []);

  const handleDownload = (rx) => {
    // MVP placeholder — wire up jsPDF/html2canvas here later for real PDF export.
    toast.success(`Preparing download for ${rx.id} (demo)`);
  };

  return (
    <DataTable
      loading={loading}
      emptyTitle="No prescriptions yet"
      emptyDescription="Prescriptions created by doctors will appear here."
      columns={[
        { key: "id", header: "Prescription ID" },
        { key: "patientName", header: "Patient" },
        { key: "doctorName", header: "Doctor" },
        { key: "date", header: "Date", render: (r) => formatDate(r.date) },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        {
          key: "actions",
          header: "Actions",
          render: (row) => (
            <Button variant="ghost" size="sm" onClick={() => handleDownload(row)}>
              Download
            </Button>
          ),
        },
      ]}
      rows={prescriptions}
    />
  );
}
