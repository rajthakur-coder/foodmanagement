

import React, { useState, useEffect, useRef } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import Icon from "../ui/Icon";

// THEME CONTEXT IMPORT
import { useTheme } from "../context/ThemeContext";

interface CustomInputProps {
  label?: string;
  placeholder?: string;
  value: string | number | null | undefined;
  type?: "email" | "password" | "text" | "number" | "textarea";
  onChange: (value: string) => void;
  leftIcon?: string;
  themeMode?: "light" | "dark"; // 👈 override theme if passed
  error?: boolean;
  helperText?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>, touched: boolean) => void;
  variant?: string;
}

export default function CustomInput({
  label = "",
  placeholder = "",
  value,
  type = "text",
  onChange,
  leftIcon,
  themeMode,
  error = false,
  helperText = "",
  onBlur,
  variant,
}: CustomInputProps) {
  const { theme } = useTheme();

  // ⭐ FINAL CORRECT THEME OVERRIDE LOGIC ⭐
  const isDark =
    themeMode === "dark"
      ? true
      : themeMode === "light"
      ? false
      : theme === "dark";

  // -----------------------------------------------

  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setMounted(true), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number" && Number(e.target.value) < 0) return;
    onChange(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setTouched(true);

    if (inputRef.current && inputRef.current.value === "") {
      setIsAutoFilled(false);
    }

    onBlur && onBlur(e, true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current?.matches(":-webkit-autofill")) {
        setIsAutoFilled(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const isPassword = type === "password";
  const valueStr = value != null ? String(value) : "";
  const shouldShrink = valueStr.trim() !== "" || isFocused || isAutoFilled;

  // 🌙 DARK / LIGHT DYNAMIC COLORS
  const backgroundColor = isDark ? "#1F2937" : "#FFFFFF";
  const textColor = isDark ? "#E5E7EB" : "#111827";
  const labelColor = isDark ? "#9CA3AF" : "#6B7280";
  const borderColor = isDark ? "#9CA3AF" : "#D1D5DB";
  const focusBorderColor = isDark ? "#9CA3AF" : "#1C252E";

  return (
    <div className="flex items-center justify-center w-full">
      <TextField
        fullWidth
        inputRef={inputRef}
        variant="outlined"
        label={label}
        placeholder={!shouldShrink ? placeholder : ""}
        type={isPassword ? (showPassword ? "text" : "password") : type}
        value={valueStr}
        onChange={handleChange}
        multiline={type === "textarea"}
        minRows={type === "textarea" ? 3 : undefined}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        error={error && touched}
        helperText={touched ? helperText : ""}
        autoComplete={
          type === "password"
            ? "new-password"
            : type === "email"
            ? "new-email"
            : "off"
        }
        name={Math.random().toString(36).substring(2)}
        InputLabelProps={{
          shrink: shouldShrink,
          sx: {
            paddingTop: "2px",
            fontWeight: 600,
            color: isFocused ? focusBorderColor : labelColor,
            backgroundColor: shouldShrink ? backgroundColor : "transparent",
            px: shouldShrink ? "0px" : 0,
            transition: "all 0.2s ease",

            ...(leftIcon &&
              !shouldShrink && {
                transform: "translate(44px, 16px) scale(1)",
              }),
               "&.Mui-focused": {
      color: isDark ? "#F3F4F6 !important" : "#1C252E !important",
    },
          },
        }}
        InputProps={{
          sx: {
            resize: type === "textarea" ? "vertical" : "none",
            overflow: "hidden",
            color:
              variant === "authKey" && valueStr.trim() !== ""
                ? "#32CD32"
                : textColor,
            backgroundColor,
            borderRadius: "0.75rem",

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isFocused ? focusBorderColor : "#9e9e9e",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: focusBorderColor,
              borderWidth: "2px",
            },

            "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
          },

          startAdornment: leftIcon ? (
            <InputAdornment position="start">
              <Icon
                name={leftIcon}
                className={`text-[18px] ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </InputAdornment>
          ) : undefined,

          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                <Icon
                  name={showPassword ? "ri-eye-fill" : "ri-eye-off-line"}
                  className={isDark ? "text-gray-400" : "text-gray-500"}
                />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
      />
    </div>
  );
}
