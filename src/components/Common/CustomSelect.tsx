

import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useTheme } from "../../components/context/ThemeContext";

export interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps<T = any> {
  label: string;
  value?: string | number;
  options?: Option[];
  onChange: (value: string | number | "") => void;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;

  fetchDataHook?: (args?: any, options?: any) => { data?: T; isLoading?: boolean };
  dataKey?: string;
  mapItem?: (item: any) => Option;
}

const CustomSelect = <T,>({
  label,
  value,
  options = [],
  onChange,
  placeholder = "Select",
  disabled = false,
  fullWidth = true,
  fetchDataHook,
  dataKey = "data",
  mapItem,
}: CustomSelectProps<T>) => {
  const { theme } = useTheme();

  // Fetch API Data
  const { data, isLoading } = fetchDataHook?.() || { data: undefined, isLoading: false };
  const [fetchedOptions, setFetchedOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (!data || !mapItem) return;

    const list: any[] =
      Array.isArray(data)
        ? data
        : Array.isArray((data as any)[dataKey])
        ? (data as any)[dataKey]
        : [];

    setFetchedOptions(list.map((item) => mapItem(item)));
  }, [data, dataKey, mapItem]);

  const allOptions = [...fetchedOptions, ...options].filter(
    (v, i, arr) => arr.findIndex((x) => x.value === v.value) === i
  );

  const selectedOption = allOptions.find((opt) => opt.value === value) ?? null;

  return (
    <Autocomplete
      disablePortal
      options={allOptions}
      getOptionLabel={(option) => option.label}
      value={selectedOption}
      loading={isLoading}
      onChange={(_, newValue) => onChange(newValue ? newValue.value : "")}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      fullWidth={fullWidth}
      popupIcon={null}

      /** ⭐ DROPDOWN (PAPER + POPPER) FIX — DARK MODE PERFECT */
slotProps={{
  paper: {
       sx: {
      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
      color: theme === "dark" ? "#e5e7eb" : "#111827",
      border: theme === "dark" ? "1px solid #374151" : "1px solid #e5e7eb",
      borderRadius: "10px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
    },
  },
  listbox: {
       className: "custom-scrollbar", 

    sx: {
      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
      color: theme === "dark" ? "#e5e7eb" : "#111827",
      padding: "6px",

      "& .MuiAutocomplete-option": {
        padding: "10px 14px",
        borderRadius: "2px",

        color: theme === "dark" ? "#e5e7eb" : "#111827",

        "&:hover": {
          backgroundColor: theme === "dark" ? "#374151" : "#f3f4f6",
        },

        "&.Mui-focused": {
          backgroundColor: theme === "dark" ? "#4b5563" : "#e5e7eb",
          color: theme === "dark" ? "#ffffff" : "#111827",
        },
      },
    },
  },
  popper: {
    sx: {
      zIndex: 999999,
    },
  },
}}


      /** ⭐ INPUT, LABEL, BORDER — FULL THEME SUPPORT */
      sx={{
        width: fullWidth ? "100%" : 300,

        "& .MuiInputBase-root": {
          backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
          color: theme === "dark" ? "#e5e7eb" : "#111827",
          borderRadius: 2,
        },

        "& .MuiInputLabel-root": {
          color: "#6b7280",
          fontWeight: 600,
        },

        "& .MuiInputLabel-root.Mui-focused": {
          fontWeight: 900,
          color: theme === "dark" ? "#e5e7eb" : "#111827",
        },

        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: theme === "dark" ? "#9CA3AF" : "#d1d5db",
          },
          "&:hover fieldset": {
            borderColor: theme === "dark" ? "#9ca3af" : "#6b7280",
          },
        },

        "& .MuiOutlinedInput-root.Mui-focused fieldset": {
          borderColor: theme === "dark" ? "#9CA3AF" : "#1C252E",
          borderWidth: 2,
        },
      }}

      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          fullWidth={fullWidth}
        />
      )}
    />
  );
};

export default CustomSelect;
