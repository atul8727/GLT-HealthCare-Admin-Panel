import { FiCheck, FiClock, FiX, FiInfo } from "react-icons/fi";
import { classNames } from "../../utils/helpers";
import { STATUS_BADGE_COLOR } from "../../utils/constants";

const BADGE_STYLES = {
  Active: {
    bg: "bg-[#DCFCE7] text-[#15803D]",
    icon: FiCheck,
  },
  Pending: {
    bg: "bg-[#FEF3C7] text-[#B45309]",
    icon: FiClock,
  },
  Inactive: {
    bg: "bg-[#FFE4E6] text-[#BE123C]",
    icon: FiX,
  },
  Rejected: {
    bg: "bg-[#FFE4E6] text-[#BE123C]",
    icon: FiX,
  },
  Cancelled: {
    bg: "bg-[#FFE4E6] text-[#BE123C]",
    icon: FiX,
  },
  Completed: {
    bg: "bg-[#DBEAFE] text-[#1D4ED8]",
    icon: FiCheck,
  },
  Approved: {
    bg: "bg-[#DBEAFE] text-[#1D4ED8]",
    icon: FiCheck,
  },
  Scheduled: {
    bg: "bg-[#DBEAFE] text-[#1D4ED8]",
    icon: FiClock,
  },
  "In Progress": {
    bg: "bg-[#FEF3C7] text-[#B45309]",
    icon: FiClock,
  },
  Generated: {
    bg: "bg-[#DCFCE7] text-[#15803D]",
    icon: FiCheck,
  },
  New: {
    bg: "bg-[#DBEAFE] text-[#1D4ED8]",
    icon: FiInfo,
  },
  Contacted: {
    bg: "bg-[#FEF3C7] text-[#B45309]",
    icon: FiClock,
  },
  Closed: {
    bg: "bg-[#DCFCE7] text-[#15803D]",
    icon: FiCheck,
  },
};

const COLOR_MAP = {
  success: {
    bg: "bg-[#DCFCE7] text-[#15803D]",
    icon: FiCheck,
  },
  warning: {
    bg: "bg-[#FEF3C7] text-[#B45309]",
    icon: FiClock,
  },
  danger: {
    bg: "bg-[#FFE4E6] text-[#BE123C]",
    icon: FiX,
  },
  info: {
    bg: "bg-[#DBEAFE] text-[#1D4ED8]",
    icon: FiInfo,
  },
  muted: {
    bg: "bg-slate-100 text-slate-600",
    icon: null,
  },
};

/**
 * <StatusBadge status="Active" />
 * Clean, modern pill badge with icon, 4px 12px padding, bold 12px font.
 */
export default function StatusBadge({ status, color, icon: CustomIcon, className }) {
  const byStatus = BADGE_STYLES[status];
  const resolvedColor = color || STATUS_BADGE_COLOR[status] || "muted";
  const byColor = COLOR_MAP[resolvedColor] || COLOR_MAP.muted;

  const styleClass = byStatus?.bg || byColor.bg;
  const IconComponent = CustomIcon !== undefined ? CustomIcon : (byStatus?.icon || byColor.icon);

  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold leading-none tracking-wide select-none",
        styleClass,
        className
      )}
    >
      {IconComponent && <IconComponent className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />}
      <span>{status}</span>
    </span>
  );
}

export { StatusBadge as Badge };
