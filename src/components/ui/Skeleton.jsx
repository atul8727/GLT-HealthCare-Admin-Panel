import { classNames } from "../../utils/helpers";

export default function Skeleton({ className }) {
  return <div className={classNames("animate-pulse rounded-xl bg-slate-200/80", className)} />;
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="overflow-hidden">
      {/* Header skeleton */}
      <div className="flex gap-4 border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3.5">
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className="h-4 w-20 flex-1 max-w-[120px] bg-slate-200" />
        ))}
      </div>
      {/* Rows skeleton */}
      <div className="divide-y divide-[#E2E8F0]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-5 py-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton
                key={c}
                className={classNames(
                  "h-4 flex-1",
                  c === 0 ? "max-w-[180px] h-5" : "max-w-[120px]"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
