import { FiEye, FiTrash2 } from "react-icons/fi";
import { DataTable, Button, StatusBadge, Avatar } from "../ui";
import { formatDate } from "../../utils/helpers";

export default function EnquiryTable({ enquiries, loading, onView, onDelete }) {
  return (
    <DataTable
      loading={loading}
      emptyTitle="No enquiries found"
      emptyDescription="New enquiries submitted from the landing page will appear here."
      columns={[
        {
          key: "fullName",
          header: "Name",
          render: (row) => (
            <div className="flex items-center gap-3">
              <Avatar name={row.fullName} />
              <span className="whitespace-normal text-sm font-bold text-[#14142B] [overflow-wrap:anywhere]">
                {row.fullName}
              </span>
            </div>
          ),
        },
        { key: "mobile", header: "Mobile" },
        {
          key: "email",
          header: "Email",
          render: (row) => (
            <span className="block max-w-[200px] whitespace-normal [overflow-wrap:anywhere]">
              {row.email || "-"}
            </span>
          ),
        },
        { key: "consultationType", header: "Type", render: (row) => row.consultationType || "-" },
        {
          key: "status",
          header: "Status",
          render: (row) => <StatusBadge status={row.status || "New"} />,
        },
        { key: "createdAt", header: "Received On", render: (row) => formatDate(row.createdAt) },
        {
          key: "actions",
          header: "Actions",
          render: (row) => (
            <div className="flex items-center gap-2">
              <Button variant="actionView" size="sm" icon={FiEye} onClick={() => onView(row)}>
                View
              </Button>
              <Button variant="actionDelete" size="sm" icon={FiTrash2} onClick={() => onDelete(row)}>
                Delete
              </Button>
            </div>
          ),
        },
      ]}
      rows={enquiries}
    />
  );
}