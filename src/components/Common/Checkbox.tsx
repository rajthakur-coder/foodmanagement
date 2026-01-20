



// import React from "react";
// import clsx from "clsx";
// import { Check } from "lucide-react";

// type CheckboxSize = "xs" | "sm" | "md" | "lg";
// type CheckboxShape = "square" | "rounded" | "roundedmd" | "circle";
// type LabelPosition = "left" | "right";

// interface CheckboxProps {
//   checked: boolean;
//   onChange: () => void;
//   size?: CheckboxSize;
//   shape?: CheckboxShape;
//   checkedColor?: string;
//   uncheckedColor?: string;
//   borderColor?: string;
//   borderWidth?: string;
//   iconColor?: string;
//   animationSpeed?: number;
//   showLabel?: boolean;
//   label?: string;
//   labelPosition?: LabelPosition;
//   checkedIcon?: React.ReactNode;
// }

// const Checkbox: React.FC<CheckboxProps> = ({
//   checked,
//   onChange,
//   size = "md",
//   shape = "rounded",
//   checkedColor = "bg-primary",
//   uncheckedColor = "bg-surface-card",
//   borderColor = "border-border-input",
//   borderWidth = "border-2",
//   iconColor = "text-white",
//   animationSpeed = 300,
//   showLabel = false,
//   label = "",
//   labelPosition = "right",
//   checkedIcon,
// }) => {
//   const sizes: Record<CheckboxSize, string> = {
//     xs: "w-4 h-4 text-[10px]",
//     sm: "w-5 h-5 text-[12px]",
//     md: "w-7 h-7 text-[14px]",
//     lg: "w-10 h-10 text-[18px]",
//   };

//   const shapes: Record<CheckboxShape, string> = {
//     square: "rounded-none",
//     rounded: "rounded",
//     roundedmd: "rounded-md",
//     circle: "rounded-full",
//   };

//   const renderIcon = (): React.ReactNode => {
//     if (checkedIcon) return checkedIcon;
//     return <Check className={clsx("w-3 h-3", iconColor)} strokeWidth={3} />;
//   };

//   return (
//     <label
//       className={clsx(
//         "flex items-center cursor-pointer select-none",
//         labelPosition === "left"
//           ? "space-x-reverse space-x-2"
//           : "space-x-2"
//       )}
//     >
//       {labelPosition === "left" && showLabel && (
//         <span className="text-sm text-text-main">{label}</span>
//       )}

//       {/* Checkbox box */}
//       <div
//         onClick={onChange}
//         className={clsx(
//           "flex items-center justify-center transition-all duration-300",
//           sizes[size],
//           shapes[shape],
//           checked ? checkedColor : uncheckedColor,
//           !checked && `${borderWidth} ${borderColor}`,
//           "shadow-sm"
//         )}
//         style={{
//           transitionDuration: `${animationSpeed}ms`,
//         }}
//       >
//         {checked && renderIcon()}
//       </div>

//       {labelPosition === "right" && showLabel && (
//         <span className="text-sm text-text-main">{label}</span>
//       )}
//     </label>
//   );
// };

// export default Checkbox;











import React from "react";
import clsx from "clsx";
import { Check } from "lucide-react";

// ⭐ Import global theme
import { useTheme } from "../context/ThemeContext";

type CheckboxSize = "xs" | "sm" | "md" | "lg";
type CheckboxShape = "square" | "rounded" | "roundedmd" | "circle";
type LabelPosition = "left" | "right";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  size?: CheckboxSize;
  shape?: CheckboxShape;
  themeMode?: "light" | "dark";   // ⭐ override
  showLabel?: boolean;
  label?: string;
  labelPosition?: LabelPosition;
  checkedIcon?: React.ReactNode;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  size = "md",
  shape = "rounded",
  themeMode,
  showLabel = false,
  label = "",
  labelPosition = "right",
  checkedIcon,
}) => {

  // ⭐ GLOBAL THEME
  const { theme } = useTheme();

  // ⭐ OVERRIDE LOGIC (same as other components)
  const isDark =
    themeMode === "dark"
      ? true
      : themeMode === "light"
      ? false
      : theme === "dark";

  // ⭐ Dynamic Colors based on theme
  const checkedBg = isDark ? "#1CBF4A" : "#1CBF4A"; 
  const uncheckedBg = isDark ? "#1F2937" : "#FFFFFF";
  const borderClr = isDark ? "#A0A0A0" : "#D1D5DB";
  const labelColor = isDark ? "#E5E7EB" : "#111827";
  const iconColor = isDark ? "text-white" : "text-white";

  // SIZES
  const sizes: Record<CheckboxSize, string> = {
    xs: "w-4 h-4 text-[10px]",
    sm: "w-5 h-5 text-[12px]",
    md: "w-7 h-7 text-[14px]",
    lg: "w-10 h-10 text-[18px]",
  };

  // SHAPES
  const shapes: Record<CheckboxShape, string> = {
    square: "rounded-none",
    rounded: "rounded",
    roundedmd: "rounded-md",
    circle: "rounded-full",
  };

  const renderIcon = () => {
    if (checkedIcon) return checkedIcon;
    return <Check className={clsx("w-3 h-3", iconColor)} strokeWidth={3} />;
  };

  return (
    <label
      onClick={onChange}
      className={clsx(
        "flex items-center cursor-pointer select-none",
        labelPosition === "left"
          ? "space-x-reverse space-x-2"
          : "space-x-2"
      )}
    >
      {/* Label LEFT */}
      {labelPosition === "left" && showLabel && (
        <span style={{ color: labelColor }} className="text-sm">
          {label}
        </span>
      )}

      {/* Checkbox box */}
      <div
        className={clsx(
          "flex items-center justify-center transition-all shadow-sm",
          sizes[size],
          shapes[shape],
          checked ? "" : "border",
        )}
        style={{
          backgroundColor: checked ? checkedBg : uncheckedBg,
          borderColor: borderClr,
          transitionDuration: "250ms",
        }}
      >
        {checked && renderIcon()}
      </div>

      {/* Label RIGHT */}
      {labelPosition === "right" && showLabel && (
        <span style={{ color: labelColor }} className="text-sm">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
