import { classNames } from "../../utils/helpers";

export default function Select({
  label,
  error,
  options = [],
  className,
  required,
  id,
  placeholder,
  ...props
}) {
  const selectId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#14142B]"
        >
          {label} {required && <span className="text-[#E11D48]">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={classNames(
            "h-11 w-full appearance-none rounded-xl border bg-[#F8FAFC] pl-3.5 pr-10 text-sm text-[#14142B]",
            "cursor-pointer transition-all duration-150 hover:border-slate-400",
            "focus:border-[#4F46E5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/15",
            error
              ? "border-[#E11D48] focus:ring-[#E11D48]/15"
              : "border-[#CBD5E1]",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-[#E11D48]">{error}</p>}
    </div>
  );
}