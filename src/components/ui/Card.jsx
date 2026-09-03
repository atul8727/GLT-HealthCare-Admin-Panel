import { classNames } from "../../utils/helpers";

export default function Card({ title, action, children, className, bodyClassName }) {
  return (
    <div className={classNames("rounded-xl border border-slate-200 bg-white shadow-card", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          {title && <h3 className="text-base font-semibold text-text-primary">{title}</h3>}
          {action}
        </div>
      )}
      <div className={classNames("p-5", bodyClassName)}>{children}</div>
    </div>
  );
}
