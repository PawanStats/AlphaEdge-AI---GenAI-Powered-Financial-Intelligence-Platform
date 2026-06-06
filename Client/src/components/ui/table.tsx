import { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

interface TableSectionProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  isHeader?: boolean;
}

export function Table({ children, className = "", ...props }: TableProps) {
  return (
    <table className={clsx("w-full border-collapse", className)} {...props}>
      {children}
    </table>
  );
}

export function TableHeader({ children, className = "", ...props }: TableSectionProps) {
  return (
    <thead className={className} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "", ...props }: TableSectionProps) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = "", ...props }: TableRowProps) {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
}

export function TableCell({ children, isHeader = false, className = "", ...props }: TableCellProps) {
  const CellTag = isHeader ? "th" : "td";
  return (
    <CellTag className={className} {...props}>
      {children}
    </CellTag>
  );
}
