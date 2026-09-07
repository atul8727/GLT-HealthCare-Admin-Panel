import { classNames } from "../../utils/helpers";

export default function Card({ title, icon: Icon, action, children, className, bodyClassName }) {
  return (
    <div
      className={classNames(
        "rounded-xl border border-slate-200 bg-white shadow-card transition-shadow hover:shadow-md",
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary">
                <Icon className="h-4 w-4" />
              </span>
            )}
            {title && <h3 className="text-base font-semibold text-text-primary">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      <div className={classNames("p-5", bodyClassName)}>{children}</div>
    </div>
  );
}
