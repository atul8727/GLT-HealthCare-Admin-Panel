import { FiSearch } from "react-icons/fi";
import { classNames } from "../../utils/helpers";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}) {
  return (
    <div className={classNames("relative w-full", className)}>
      <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] pl-10 pr-4 text-sm text-[#14142B] placeholder:text-[#94A3B8] transition-all duration-150 hover:border-slate-400 focus:border-[#4F46E5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/15"
      />
    </div>
  );
}
