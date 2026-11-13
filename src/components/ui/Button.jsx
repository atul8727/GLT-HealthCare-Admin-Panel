import { classNames } from "../../utils/helpers";

const VARIANTS = {
  primary:
    "bg-gradient-to-r from-[#4F46E5] to-[#6D5BF0] text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:opacity-95 hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] focus:ring-indigo-500/25",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 focus:ring-slate-200 shadow-sm",
  outlineIndigo:
    "border border-indigo-200 bg-white text-[#4F46E5] hover:bg-indigo-50/70 hover:border-indigo-300 focus:ring-indigo-100 shadow-sm",
  danger:
    "bg-gradient-to-r from-[#E11D48] to-[#F43F5E] text-white shadow-[0_4px_14px_rgba(225,29,72,0.3)] hover:opacity-95 hover:shadow-[0_6px_20px_rgba(225,29,72,0.4)] focus:ring-rose-500/25",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200",
  success:
    "bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white shadow-[0_4px_14px_rgba(22,163,74,0.3)] hover:opacity-95 hover:shadow-[0_6px_20px_rgba(22,163,74,0.4)] focus:ring-emerald-500/25",
  edit:
    "bg-gradient-to-r from-[#0EA5E9] to-[#2B7FD1] text-white shadow-[0_4px_14px_rgba(14,165,233,0.3)] hover:opacity-95 hover:shadow-[0_6px_20px_rgba(14,165,233,0.4)] focus:ring-sky-500/25",
  // Action variants for table rows
  actionView:
    "border border-indigo-200 bg-white text-[#4F46E5] hover:bg-indigo-50 hover:border-indigo-300 focus:ring-indigo-100 shadow-sm",
  actionEdit:
    "bg-gradient-to-r from-[#0EA5E9] to-[#2B7FD1] text-white hover:opacity-95 shadow-sm focus:ring-sky-500/25",
  actionDelete:
    "bg-gradient-to-r from-[#E11D48] to-[#F43F5E] text-white hover:opacity-95 shadow-sm focus:ring-rose-500/25",
  actionApprove:
    "bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white hover:opacity-95 shadow-sm focus:ring-emerald-500/25",
  actionReject:
    "bg-gradient-to-r from-[#E11D48] to-[#F43F5E] text-white hover:opacity-95 shadow-sm focus:ring-rose-500/25",
};

const SIZES = {
  sm: "text-xs px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2.5 rounded-xl font-semibold",
  lg: "text-base px-5 py-3 rounded-xl font-semibold",
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
  const isIconOnly = !children && Icon;

  return (
    <button
      disabled={disabled || loading}
      className={classNames(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 cursor-pointer",
        "focus:outline-none focus:ring-4 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed",
        "active:scale-[0.98]",
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        isIconOnly && (size === "sm" ? "!p-2" : "!p-2.5"),
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {!loading && Icon && <Icon className="h-4 w-4 shrink-0" />}
      {children}
    </button>
  );
}
