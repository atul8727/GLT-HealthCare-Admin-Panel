import { classNames } from "../../utils/helpers";

export default function Tabs({ tabs, active, onChange, className }) {
  return (
    <div
      className={classNames(
        "inline-flex max-w-full overflow-x-auto rounded-[14px] border border-[#E2E8F0] bg-white p-[5px] shadow-xs",
        className
      )}
    >
      <nav className="flex items-center gap-1">
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={classNames(
                "whitespace-nowrap rounded-xl px-4 py-1.5 text-sm font-semibold transition-all duration-150 cursor-pointer",
                isActive
                  ? "bg-[#4F46E5] text-white shadow-xs"
                  : "text-[#4F46E5] hover:bg-slate-100/70 hover:text-indigo-800"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
