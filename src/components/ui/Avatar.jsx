import { classNames, getInitials } from "../../utils/helpers";

const COLORS = [
  "bg-indigo-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-sky-600",
  "bg-rose-500",
  "bg-amber-500",
];

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

function pickColor(name = "") {
  let sum = 0;
  for (let i = 0; i < name.length; i += 1) sum += name.charCodeAt(i);
  return COLORS[sum % COLORS.length];
}

export default function Avatar({ name = "", size = "md", className }) {
  return (
    <span
      className={classNames(
        "flex shrink-0 items-center justify-center rounded-full font-bold text-white",
        SIZES[size] || SIZES.md,
        pickColor(name),
        className
      )}
    >
      {getInitials(name)}
    </span>
  );
}