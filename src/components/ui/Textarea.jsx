import { classNames } from "../../utils/helpers";

export default function Textarea({ label, error, className, required, id, ...props }) {
  const areaId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={areaId} className="mb-1.5 block text-sm font-medium text-text-primary">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <textarea
        id={areaId}
        rows={3}
        className={classNames(
          "w-full rounded-lg border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
          error ? "border-danger" : "border-slate-300",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
