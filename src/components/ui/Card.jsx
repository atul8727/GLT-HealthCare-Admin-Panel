import { classNames } from "../../utils/helpers";

export default function Card({ title, icon: Icon, action, children, className, bodyClassName }) {
  return (
    <div
      className={classNames(
        "rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_8px_24px_rgba(79,70,229,0.08)] transition-all",
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#1D6FE0] shadow-xs">
                <Icon className="h-5 w-5" />
              </span>
            )}
            {title && <h3 className="text-base font-bold text-[#14142B]">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      <div className={classNames("p-6", bodyClassName)}>{children}</div>
    </div>
  );
}