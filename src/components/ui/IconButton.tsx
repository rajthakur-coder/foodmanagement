
// import type { ReactNode } from "react";
// import clsx from "clsx";

// interface IconButtonProps {
//   onClick?: () => void;
//   children: ReactNode;
//   ripple?: boolean;
//   className?: string;
// }

// const IconButton = ({ onClick, children, ripple = true, className }: IconButtonProps) => (
//   <button
//     onClick={onClick}
//     data-ripple={ripple}
//     className={clsx(
//       "p-2 rounded-full transition transform",
//       "hover:scale-110 active:scale-95",
//       "text-text-subtle",
//       "hover:bg-surface-hover", 
//       className 
//     )}
//   >
//     {children}
//   </button>
// );

// export default IconButton;




import type { ReactNode, MouseEventHandler } from "react";
import clsx from "clsx";

interface IconButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  ripple?: boolean;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  children,
  ripple = true,
  className,
}) => (
  <button
    onClick={onClick}
    data-ripple={ripple}
    className={clsx(
      "p-2 rounded-full transition transform",
      "hover:scale-110 active:scale-95",
      "text-text-subtle",
      "hover:bg-surface-hover",
      className
    )}
  >
    {children}
  </button>
);

export default IconButton;
