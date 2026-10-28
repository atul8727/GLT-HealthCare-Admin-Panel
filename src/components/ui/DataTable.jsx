import { TableSkeleton } from "./Skeleton";
import EmptyState from "./EmptyState";

/**
 * <DataTable /> — the ONE table component the whole app should use.
 * columns: [{ key, header, render? }]
 * rows: array of data objects
 */
export default function DataTable({
  columns,
  rows,
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "",
  emptyAction,
  rowKey = "id",
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
        <TableSkeleton cols={columns.length} />
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
        <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
      <table className="min-w-full border-collapse">
        <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.06em] text-[#64748B]"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E8F0]">
          {rows.map((row) => (
            <tr key={row[rowKey]} className="hover:bg-slate-50/80 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-5 py-4 text-sm text-[#14142B] align-middle">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
