


import React from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

// === Types ===
type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonColor = "primary" | "secondary" | "danger" | "success" | "surface" ;
type ButtonSize = "xs" | "sm" | "md" | "lg";
type ButtonShape = "square" | "rounded" | "circle";
type LoaderType = "default" | "bounce";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: React.ElementType<{ className?: string }>;
  iconPosition?: "left" | "right";
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: ButtonShape;
  variant?: ButtonVariant;
  loading?: boolean;
  loaderType?: LoaderType; // ⭐ NEW
  animationSpeed?: number;
  width?: string | number;
  height?: string | number;
}

// === Component ===
export const Button: React.FC<ButtonProps> = ({
  text = "Button",
  icon: Icon,
  iconPosition = "left",
  color = "primary",
  size = "md",
  shape = "rounded",
  variant = "solid",
  loading = false,
  loaderType = "default", // ⭐ NEW
  disabled = false,
  animationSpeed = 200,
  width,
  height,
  className,
  ...props
}) => {
  // === Sizes ===
  const sizes: Record<ButtonSize, string> = {
    xs: "text-xs px-2 py-1",
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };

  // === Shapes ===
  const shapes: Record<ButtonShape, string> = {
    square: "rounded-none",
    rounded: "rounded-md",
    circle: "rounded-full",
  };

  // === Variants & Colors ===
  const baseColors: Record<ButtonColor, Record<ButtonVariant, string>> = {
    primary: {
      solid: "bg-primary text-white hover:bg-primary/90",
      outline: "border border-border-input text-primary hover:bg-primary/10",
      ghost: "text-primary hover:bg-primary/10",
    },
    secondary: {
      solid: "bg-secondary text-white hover:bg-secondary/90",
      outline:
        "border border-border-input text-secondary hover:bg-secondary/10",
      ghost: "text-secondary hover:bg-secondary/10",
    },
    success: {
      solid: "bg-success text-white hover:bg-success/90",
      outline: "border border-border-input text-success hover:bg-success/10",
      ghost: "text-success hover:bg-success/10",
    },
    danger: {
      solid: "bg-danger text-white hover:bg-danger/90",
      outline: "border border-border-input text-danger hover:bg-danger/10",
      ghost: "text-danger hover:bg-danger/10",
    },
    surface: {
      solid: "bg-dark text-white ",
      outline: "border border-border-input text-text-main hover:bg-surface-hover",
      ghost: "text-text-main hover:bg-surface-hover",
    },
  };

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-medium shadow-sm select-none transition-all",
        baseColors[color][variant],
        sizes[size],
        shapes[shape],
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{
        width: width ?? "150px",
        height: height ?? "auto",
        transitionDuration: `${animationSpeed}ms`,
      }}
      {...props}
    >
      {/* Left Icon */}
      {!loading && Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}

      {/* Loader + Text */}
    {loading ? (
  <>
    {loaderType === "bounce" ? (
      <div className="flex items-center justify-center">
        <div className="loader" />
      </div>
    ) : (
      <div className="flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{text}</span>
      </div>
    )}
  </>
) : (
  <span>{text}</span>
)}


      {/* Right Icon */}
      {!loading && Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
    </button>
  );
};

