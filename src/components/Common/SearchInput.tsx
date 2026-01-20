
import React, { useState } from "react";
import clsx from "clsx";
import Icon from "../ui/Icon";

// ⭐ Import global Theme Context
import { useTheme } from "../context/ThemeContext";

interface SearchInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  width?: string;
  height?: string;
  className?: string;
  wrapperClassName?: string;
  themeMode?: "light" | "dark"; 
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  width = "100%",
  height = "54px",
  className,
  wrapperClassName,
  themeMode,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const shouldFloat: boolean = isFocused || value.trim() !== "";

  // GET GLOBAL THEME
  const { theme } = useTheme();

  // SAME OVERRIDE LOGIC AS CUSTOM INPUT
  const isDark =
    themeMode === "dark"
      ? true
      : themeMode === "light"
      ? false
      : theme === "dark";

  // Dynamic Colors
  const bgColor = isDark ? "#1F2937" : "#FFFFFF";
  const borderColor = isDark ? "#9CA3AF" : "#D1D5DB";
  const focusBorderColor = isDark ? "#9CA3AF" : "#1C252E";
  const textColor = isDark ? "#E5E7EB" : "#111827";
  const labelColor = isDark ? "#9CA3AF" : "#6B7280";

  return (
    <div
      className={clsx("relative w-full", wrapperClassName)}
      style={{ width, height }}
    >
      {/* Search Icon */}
      <Icon
        name="ri-search-line"
        className={clsx(
          "absolute left-3 top-1/2 -translate-y-1/2",
          isDark ? "text-gray-400" : "text-gray-500"
        )}
        size={18}
      />

      {/* Floating Label */}
      <span
        className={clsx(
          "absolute left-10 transition-all duration-200 ease-in-out pointer-events-none",
          shouldFloat
            ? "-top-2 text-xs font-medium"
            : "top-1/2 -translate-y-1/2 text-sm"
        )}
        style={{
          backgroundColor: shouldFloat ? bgColor : "transparent",
          color: isFocused ? focusBorderColor : labelColor,
          padding: shouldFloat ? "0 4px" : "0",
        }}
      >
        {placeholder}
      </span>

      {/* Input box */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={clsx(
          `w-full h-full pl-10 pr-3 text-sm rounded-xl border outline-none transition-all duration-200`,
          className
        )}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderColor: isFocused ? focusBorderColor : borderColor,
          boxShadow: isFocused
            ? `0 0 0 1px ${focusBorderColor}`
            : "none",
        }}
      />
    </div>
  );
};

export default SearchInput;
