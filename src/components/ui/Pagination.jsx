import { classNames } from "../../utils/helpers";

const NAV_BTN =
  "cursor-pointer rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#4F46E5] shadow-xs transition-colors " +
  "hover:border-indigo-200 hover:bg-indigo-50 " +
  "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:hover:border-[#E2E8F0] disabled:hover:bg-slate-50";

export default function Pagination({
  page = 1,
  totalPages = 1,
  totalItems,
  showingCount,
  onPageChange,
  className,
}) {
  const displayPages = Math.max(1, totalPages || 1);
  const displayCurrent = Math.max(1, page || 1);

  return (
    <div
      className={classNames(
        "flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] px-1 pt-4",
        className
      )}
    >
      <p className="text-sm text-[#64748B]">
        Page {displayCurrent} of {displayPages}
        {totalItems !== undefined && (
          <span> — Showing {showingCount !== undefined ? showingCount : totalItems} of {totalItems}</span>
        )}
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={displayCurrent <= 1}
          onClick={() => onPageChange && onPageChange(displayCurrent - 1)}
          className={NAV_BTN}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={displayCurrent >= displayPages}
          onClick={() => onPageChange && onPageChange(displayCurrent + 1)}
          className={NAV_BTN}
        >
          Next
        </button>
      </div>
    </div>
  );
}