import { ReactNode } from "react";
import clsx from "clsx";

type BadgeColor = "success" | "warning" | "error" | "primary";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  color?: BadgeColor;
  size?: BadgeSize;
  className?: string;
}

const colorClasses: Record<BadgeColor, string> = {
  success: "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  warning: "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400",
  error: "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400",
  primary: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400",
};

export default function Badge({ children, color = "primary", size = "md", className = "" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        colorClasses[color],
        className
      )}
    >
      {children}
    </span>
  );
}
