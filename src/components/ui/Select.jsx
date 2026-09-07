import { classNames } from "../../utils/helpers";

export default function Select({ label, error, options = [], className, required, id, placeholder, ...props }) {
  const selectId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-text-primary">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={classNames(
          "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-text-primary",
          "transition-all duration-150 hover:border-slate-400",
          "focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary",
          error ? "border-danger focus:ring-danger/15" : "border-slate-300",
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
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
