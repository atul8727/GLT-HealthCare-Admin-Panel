import { classNames } from "../../utils/helpers";

export default function Input({ label, error, className, required, id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text-primary">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={classNames(
          "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted",
          "transition-all duration-150 hover:border-slate-400",
          "focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary",
          error ? "border-danger focus:ring-danger/15" : "border-slate-300",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
