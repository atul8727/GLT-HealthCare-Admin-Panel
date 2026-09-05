import { classNames } from "../../utils/helpers";

/**
 * Simple on/off toggle switch — used wherever a row has a binary
 * Active/Inactive style status that should be flippable inline
 * (e.g. Doctors list "Actions" column) instead of a text button.
 */
export default function ToggleSwitch({ checked, onChange, loading = false, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled || loading}
      onClick={() => onChange(!checked)}
      className={classNames(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1",
        checked ? "bg-success" : "bg-slate-300",
        (disabled || loading) && "opacity-60 cursor-not-allowed"
      )}
    >
      <span
        className={classNames(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-150",
          checked ? "translate-x-6" : "translate-x-1",
          loading && "animate-pulse"
        )}
      />
    </button>
  );
}