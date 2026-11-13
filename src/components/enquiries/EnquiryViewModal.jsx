import { Modal, StatusBadge, Avatar } from "../ui";
import { formatDate } from "../../utils/helpers";

const TILE = "rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3";
const TILE_LABEL = "text-xs font-semibold uppercase tracking-wider text-[#64748B]";
const TILE_VALUE = "mt-1 text-sm font-semibold text-[#14142B] [overflow-wrap:anywhere]";

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
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={enquiry.fullName} size="lg" />
            <h4 className="text-base font-bold text-[#14142B] [overflow-wrap:anywhere]">
              {enquiry.fullName}
            </h4>
          </div>
          <StatusBadge status={enquiry.status || "New"} className="shrink-0" />
        </div>

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label} className={TILE}>
              <dt className={TILE_LABEL}>{label}</dt>
              <dd className={TILE_VALUE}>{value}</dd>
            </div>
          ))}
          <div className={`${TILE} sm:col-span-2`}>
            <dt className={TILE_LABEL}>Message</dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm font-medium text-[#14142B] [overflow-wrap:anywhere]">
              {enquiry.message || "-"}
            </dd>
          </div>
        </dl>
      </div>
    </Modal>
  );
}