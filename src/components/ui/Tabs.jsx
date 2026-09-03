import { classNames } from "../../utils/helpers";

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="border-b border-slate-200">
      <nav className="-mb-px flex gap-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={classNames(
              "whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors",
              active === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
