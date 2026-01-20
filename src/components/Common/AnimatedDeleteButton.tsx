// import { useState } from "react";
// import Icon from "../ui/Icon";
// import clsx from "clsx";

// interface AnimatedDeleteButtonProps {
//   onClick?: () => void;
//   label?: string;
// }

// const AnimatedDeleteButton: React.FC<AnimatedDeleteButtonProps> = ({
//   onClick,
//   label = "Clear",
// }) => {
//   const [isDeleting, setIsDeleting] = useState(false);

//   const handleClick = () => {
//     if (isDeleting) return;
//     setIsDeleting(true);
//     onClick?.();
//     setTimeout(() => setIsDeleting(false), 2200);
//   };

//   return (
//     <button
//       onClick={handleClick}
//       className={clsx(
//         "flex items-center gap-1 text-sm font-semibold",
//         "text-action-danger",
//         "hover:bg-action-danger-hover-bg",
//         "rounded-md p-1.5 relative overflow-hidden",
//         "active:scale-95 transition-all duration-300"
//       )}
//     >
//       {/* Icon with simple transform animation */}
//       <Icon
//         name="bx bx-trash"
//         className={clsx(
//           "w-5 h-5 transform transition-transform duration-300",
//           isDeleting ? "scale-125 rotate-[20deg] text-white" : ""
//         )}
//       />
//       <span
//         className={`transition-all duration-[2200ms] ${isDeleting ? "opacity-0 translate-y-12 rotate-[80deg] scale-50" : ""
//           }`}
//       >
//         {label}
//       </span>
//     </button>
//   );
// };

// export default AnimatedDeleteButton;

















import { useState } from "react";
import Icon from "../ui/Icon";
import clsx from "clsx";

interface AnimatedDeleteButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}

const AnimatedDeleteButton: React.FC<AnimatedDeleteButtonProps> = ({
  onClick,
  label = "Clear",
  disabled = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = () => {
    if (disabled || isDeleting) return;
    setIsDeleting(true);

    // Trigger delete action
    onClick?.();

    // Reset animation after 2.2s
    const timeout = setTimeout(() => {
      setIsDeleting(false);
    }, 2200);

    return () => clearTimeout(timeout);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isDeleting}
      aria-label={label}
      className={clsx(
        "flex items-center gap-1 text-sm font-semibold relative overflow-hidden rounded-md p-1.5 transition-all duration-300",
        "text-action-danger hover:bg-action-danger-hover-bg active:scale-95",
        (disabled || isDeleting) && "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Trash Icon Animation */}
      <Icon
        name="bx bx-trash"
        className={clsx(
          "w-5 h-5 transform transition-transform duration-300 ease-in-out",
          isDeleting && "scale-125 rotate-[20deg] text-white"
        )}
      />

      {/* Label Animation */}
      <span
        className={clsx(
          "transition-all duration-[2200ms] ease-in-out",
          isDeleting
            ? "opacity-0 translate-y-12 rotate-[80deg] scale-50"
            : "opacity-100 translate-y-0 rotate-0 scale-100"
        )}
      >
        {label}
      </span>
    </button>
  );
};

export default AnimatedDeleteButton;
