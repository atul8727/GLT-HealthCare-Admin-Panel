export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14">
      <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-indigo-100 border-t-[#4F46E5]" />
      <p className="text-sm font-medium text-[#64748B]">{label}</p>
    </div>
  );
}