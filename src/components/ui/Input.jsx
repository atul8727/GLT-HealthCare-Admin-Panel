import { classNames } from "../../utils/helpers";

export default function Input({ label, error, className, required, id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#14142B]"
        >
          {label} {required && <span className="text-[#E11D48]">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={classNames(
          "h-11 w-full rounded-xl border bg-[#F8FAFC] px-3.5 text-sm text-[#14142B] placeholder:text-[#94A3B8]",
          "transition-all duration-150 hover:border-slate-400",
          "focus:border-[#4F46E5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/15",
          error
            ? "border-[#E11D48] focus:ring-[#E11D48]/15"
            : "border-[#CBD5E1]",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-[#E11D48]">{error}</p>}
    </div>
  );
}
