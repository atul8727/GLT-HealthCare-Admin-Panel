import { useNavigate } from "react-router-dom";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { DataTable, Button, StatusBadge } from "../ui";
import { calculateAge } from "../../utils/helpers";

export default function PatientTable({ patients, loading, onDelete }) {
  const navigate = useNavigate();

  return (
    <DataTable
      loading={loading}
      emptyTitle="No patients found"
      emptyDescription="Register your first patient to get started."
      columns={[
        { key: "name", header: "Name" },
        { key: "mobile", header: "Mobile" },
        { key: "age", header: "Age", render: (row) => calculateAge(row.dob) },
        { key: "gender", header: "Gender" },
        {
          key: "status",
          header: "Status",
          render: (row) => <StatusBadge status={row.status || "Active"} />,
        },
        {
          key: "actions",
          header: "Actions",
          render: (row) => (
            <div className="flex items-center gap-1.5">
              <Button
                variant="actionView"
                size="sm"
                icon={FiEye}
                onClick={() => navigate(`/patients/${row.id}`)}
              >
                View
              </Button>
              <Button
                variant="actionEdit"
                size="sm"
                icon={FiEdit2}
                onClick={() => navigate(`/patients/${row.id}/edit`)}
              >
                Edit
              </Button>
              <Button variant="actionDelete" size="sm" icon={FiTrash2} onClick={() => onDelete(row)}>
                Delete
              </Button>
            </div>
          ),
        },
      ]}
      rows={patients}
    />
  );
}
