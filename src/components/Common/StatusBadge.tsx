
import React from "react";
import clsx from "clsx";
import { Spinner } from "reactstrap";

interface StatusBadgeProps {
  status: "All" | "Active" | "Inactive" | "Banned";
  onClick?: () => void;
  loading?: boolean;
  className?: string;
  displayText?: string; // ✅ New prop for custom text
}

// Tailwind-style custom badge classes
const STATUS_CLASSES: Record<Exclude<StatusBadgeProps["status"], "All">, string> = {
  Active: "bg-badge-completed-bg text-badge-completed-text",
  Inactive: "bg-badge-cancelled-bg text-badge-cancelled-text",
  Banned: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  onClick,
  loading = false,
  className,
  displayText,
}) => {
  const classes: string =
    status === "All"
      ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white"
      : STATUS_CLASSES[status];

  return (
    <span
      className={clsx(
        "px-2 py-1.5 rounded-md text-xs font-semibold cursor-pointer inline-flex items-center gap-1 transition",
        classes,
        {
          "opacity-70": loading,
          "hover:opacity-90": !loading,
        },
        className
      )}
      onClick={loading ? undefined : onClick}
      role="status"
    >
      {loading ? (
        <Spinner size="sm" style={{ width: "1rem", height: "1rem" }} />
      ) : (
        displayText || status // ✅ displayText agar pass ho to dikhaye, else default status
      )}
    </span>
  );
};

export default StatusBadge;
