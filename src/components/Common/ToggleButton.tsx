import React from "react";
import clsx from "clsx";

interface ToggleButtonProps {
  isOn: boolean;
  onToggle: () => void;
  size?: "xs" | "sm" | "md" | "lg";
  onColor?: string;
  offColor?: string;
  knobColor?: string;
  animationSpeed?: number;
  showLabels?: boolean;
  onLabel?: string;
  offLabel?: string;
  borderColor?: string;
  borderWidth?: number;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isOn,
  onToggle,
  size = "md",
  onColor = "bg-gradient-to-r from-blue-500 to-blue-600",
  offColor = "bg-gray-700",
  knobColor = "bg-white",
  animationSpeed = 300,
  showLabels = false,
  onLabel = "On",
  offLabel = "Off",
  borderColor = "border-border-input",
  borderWidth = 2,
}) => {
  const sizes: Record<
    NonNullable<ToggleButtonProps["size"]>,
    { w: string; h: string; knob: string; translate: string }
  > = {
    xs: { w: "w-6", h: "h-3", knob: "w-2 h-2", translate: "translate-x-3" },
    sm: { w: "w-10", h: "h-5", knob: "w-4 h-4", translate: "translate-x-5" },
    md: { w: "w-14", h: "h-7", knob: "w-6 h-6", translate: "translate-x-7" },
    lg: { w: "w-20", h: "h-10", knob: "w-8 h-8", translate: "translate-x-10" },
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      {showLabels && (
        <span
          className={clsx(
            "text-sm font-medium select-none transition-colors duration-300",
            "text-text-main"
          )}
        >
          {isOn ? onLabel : offLabel}
        </span>
      )}

      <button
        type="button"
        onClick={onToggle}
        className={clsx(
          "relative rounded-full transition-all focus:outline-none shadow-inner flex items-center",
          sizes[size].w,
          sizes[size].h,
          isOn ? onColor : offColor,
          !isOn && borderColor
        )}
        style={{
          borderWidth: !isOn ? `${borderWidth}px` : "0px",
          transitionDuration: `${animationSpeed}ms`,
        }}
      >
        <span
          className={clsx(
            "absolute rounded-full transform transition-all ease-in-out",
            sizes[size].knob,
            isOn ? sizes[size].translate : "translate-x-0",
            isOn
              ? `${knobColor} shadow-[0_0_10px_rgba(255,255,255,0.8),0_0_20px_rgba(255,255,255,0.5)]`
              : "bg-surface-card "
          )}
          style={{
            top: "50%",
            left: "0.15rem",
            transform: `translateY(-50%) ${isOn ? "translateX(calc(100% - -2.9px))" : ""}`,
            transitionDuration: `${animationSpeed}ms`,
          }}
        />
      </button>
    </div>
  );
};

export default ToggleButton;
