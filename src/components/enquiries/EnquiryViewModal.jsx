import { Modal, StatusBadge } from "../ui";
import { formatDate } from "../../utils/helpers";

export default function EnquiryViewModal({ enquiry, onClose }) {
  if (!enquiry) return null;

  const rows = [
    ["Full Name", enquiry.fullName],
    ["Mobile", enquiry.mobile],
    ["Email", enquiry.email || "-"],
    ["Consultation Type", enquiry.consultationType || "-"],
    ["Received On", formatDate(enquiry.createdAt)],
  ];

  return (
    <Modal isOpen={Boolean(enquiry)} onClose={onClose} title="Enquiry Details" size="md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text-primary">{enquiry.fullName}</h4>
          <StatusBadge status={enquiry.status || "New"} />
        </div>

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                {label}
              </dt>
              <dd className="mt-1 text-sm text-text-primary">{value}</dd>
            </div>
          ))}
        </dl>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Message</dt>
          <dd className="mt-1 whitespace-pre-wrap text-sm text-text-primary">
            {enquiry.message || "-"}
          </dd>
        </div>
      </div>
    </Modal>
  );
}