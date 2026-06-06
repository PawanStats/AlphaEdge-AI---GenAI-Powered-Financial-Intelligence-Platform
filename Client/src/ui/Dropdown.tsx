import { ReactNode } from "react";
import { Link } from "react-router";

// ─── Dropdown ───────────────────────────────────────
interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const Dropdown = ({
  isOpen,
  children,
  className = "",
}: DropdownProps) => {
  if (!isOpen) return null;
  return (
    <div
      className={`absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 ${className}`}
    >
      {children}
    </div>
  );
};

// ─── DropdownItem ────────────────────────────────────
interface DropdownItemProps {
  children: ReactNode;
  onItemClick?: () => void;
  className?: string;
  tag?: "a" | "button" | "div";
  to?: string;
  href?: string;
}

export const DropdownItem = ({
  children,
  onItemClick,
  className = "",
  tag = "div",
  to,
  href,
}: DropdownItemProps) => {
  const sharedClassName = `px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${className}`;

  if (tag === "button") {
    return (
      <button type="button" onClick={onItemClick} className={sharedClassName}>
        {children}
      </button>
    );
  }

  if (tag === "a" && to) {
    return (
      <Link to={to} onClick={onItemClick} className={sharedClassName}>
        {children}
      </Link>
    );
  }

  if (tag === "a" && href) {
    return (
      <a href={href} onClick={onItemClick} className={sharedClassName}>
        {children}
      </a>
    );
  }

  return (
    <div
      onClick={onItemClick}
      className={sharedClassName}
    >
      {children}
    </div>
  );
};