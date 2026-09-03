import { classNames } from "../../utils/helpers";
import { STATUS_BADGE_COLOR } from "../../utils/constants";

const COLOR_MAP = {
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-sky-100 text-sky-700",
  muted: "bg-slate-100 text-slate-600",
};

/**
 * <StatusBadge status="Active" /> — color is auto-resolved from
 * STATUS_BADGE_COLOR in utils/constants.js so every module looks consistent.
 * Pass `color` directly to override.
 */
export default function StatusBadge({ status, color, className }) {
  const resolved = color || STATUS_BADGE_COLOR[status] || "muted";
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        COLOR_MAP[resolved],
        className
      )}
    >
      {status}
    </span>
  );
}
