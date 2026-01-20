
// import type { ReactNode } from "react";
// import clsx from "clsx";

// interface ContentModalProps {
//   children: ReactNode;
// }

// const ContentModal = ({ children }: ContentModalProps) => {
//   return (
//     <div
//       className={clsx(
//         "bg-surface-card border border-border-primary shadow-lg dark:shadow-black/30",
//         "rounded-xl p-1.5 flex flex-col gap-1"
//       )}
//     >
//       {children}
//     </div>
//   );
// };

// interface ContentModalItemProps {
//   icon: ReactNode;
//   label: string;
//   onClick: () => void;
//   danger?: boolean;
// }

// const ContentModalItem = ({
//   icon,
//   label,
//   onClick,
//   danger,
// }: ContentModalItemProps) => {

//   const textColorClass = danger
//     ? "text-action-danger"
//     : "text-text-main";
//   return (
//     <div
//       className={clsx(
//         "flex items-center gap-3 p-1 cursor-pointer rounded-lg transition-colors duration-200",
//         "hover:bg-surface-hover",
//         textColorClass
//       )}
//       onClick={onClick}
//     >
//       {icon}
//       <span className="text-[11px] font-medium">{label}</span>
//     </div>
//   );
// };

// export { ContentModal, ContentModalItem };
















import React, { type ReactNode } from "react";
import clsx from "clsx";

interface ContentModalProps {
  children: ReactNode;
}

const ContentModal: React.FC<ContentModalProps> = ({ children }) => {
  return (
    <div
      className={clsx(
        "bg-surface-card border border-border-primary shadow-lg dark:shadow-black/30",
        "rounded-xl p-1.5 flex flex-col gap-1"
      )}
    >
      {children}
    </div>
  );
};

interface ContentModalItemProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

const ContentModalItem: React.FC<ContentModalItemProps> = ({
  icon,
  label,
  onClick,
  danger = false,
}) => {
  const textColorClass = danger ? "text-action-danger" : "text-text-main";

  return (
    <div
      className={clsx(
        "flex items-center gap-3 p-1 cursor-pointer rounded-lg transition-colors duration-200",
        "hover:bg-surface-hover",
        textColorClass
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      {icon}
      <span className="text-[11px] font-medium">{label}</span>
    </div>
  );
};

export { ContentModal, ContentModalItem };
