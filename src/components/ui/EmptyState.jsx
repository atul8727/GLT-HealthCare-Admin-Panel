import { FiInbox } from "react-icons/fi";

export default function EmptyState({
  icon: Icon = FiInbox,
  title = "Nothing here yet",
  description = "",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5] shadow-xs">
        <Icon className="h-7 w-7" />
      </div>
      <p className="text-base font-bold text-[#14142B]">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-[#64748B]">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
