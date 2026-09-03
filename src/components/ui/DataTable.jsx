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
      <div className="rounded-xl border border-slate-200 bg-white">
        <TableSkeleton cols={columns.length} />
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white">
        <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row[rowKey]} className="hover:bg-slate-50/70 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3 text-sm text-text-primary">
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
