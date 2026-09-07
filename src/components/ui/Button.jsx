import { classNames } from "../../utils/helpers";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-blue-700 focus:ring-primary/40",
  secondary: "bg-slate-100 text-text-primary hover:bg-slate-200 focus:ring-slate-300",
  outline: "border border-slate-300 text-text-primary hover:bg-slate-50 focus:ring-slate-300",
  danger: "bg-danger text-white hover:bg-red-700 focus:ring-danger/40",
  ghost: "text-text-secondary hover:bg-slate-100 focus:ring-slate-300",
  success: "bg-success text-white hover:bg-green-700 focus:ring-success/40",
  // Soft, colorful "pill" variants for row-level actions (View/Edit/Delete)
  // so tables read as more scannable and less monotone-grey.
  actionView: "bg-sky-50 text-sky-600 hover:bg-sky-100 focus:ring-sky-300",
  actionEdit: "bg-green-50 text-green-600 hover:bg-green-100 focus:ring-green-300",
  actionDelete: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-300",
};

const SIZES = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-2.5",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  className,
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150",
        "focus:outline-none focus:ring-4 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed",
        "active:scale-[0.98]",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {!loading && Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}
