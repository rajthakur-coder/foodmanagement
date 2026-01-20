

import React, { useState, useMemo, useEffect } from "react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { useTheme } from "../context/ThemeContext";

interface CustomDatePickerProps {
  label?: string;
  value?: Dayjs | null;
  onChange?: (value: string) => void;
  disableFuture?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label = "Start Date",
  value,
  onChange,
  disableFuture = true,
}) => {
  const [internalValue, setInternalValue] = useState<Dayjs | null>(
    value ?? null
  );
  const { theme } = useTheme();

  // Sync external value updates
  useEffect(() => {
    if (value?.toString() !== internalValue?.toString()) {
      setInternalValue(value ?? null);
    }
  }, [value, internalValue]);

  // Handle change and propagate formatted date
  const handleChange = (newValue: Dayjs | null) => {
    setInternalValue(newValue);

    if (onChange) {
      onChange(newValue ? newValue.format("YYYY-MM-DD") : "");
    }
  };

  // Dynamically themed MUI setup
  const appliedTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
          primary: { main: "#1C252E" },
          background: {
            default: theme === "dark" ? "#1F2937" : "#F9FAFB",
            paper: theme === "dark" ? "#374151" : "#FFFFFF",
          },
          text: {
            primary: theme === "dark" ? "#F9FAFB" : "#111827",
            secondary: theme === "dark" ? "#D1D5DB" : "#6B7280",
          },
        },
        typography: {
          fontSize: 12,
          fontFamily:
            '"Barlow", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: "0.75rem",
                backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF",
                color: theme === "dark" ? "#F9FAFB" : "#111827",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#9e9e9e",
                },
              },
            },
          },
 MuiInputLabel: {
    styleOverrides: {
      root: {
        top: "3px", 
         fontWeight: 700, 
        "&.Mui-focused": {
          top: "3px", 
           fontWeight: 700, 
        },
      },
    },
  },


          
          MuiPickersDay: {
            styleOverrides: {
              root: {
                fontSize: "0.8rem",
                fontWeight: 600,
                fontFamily:
                  '"Barlow", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                "&:hover": {
                  backgroundColor:
                    theme === "dark"
                      ? "#6B7280 !important"
                      : "#e5e7eb !important",
                  color:
                    theme === "dark"
                      ? "#F9FAFB !important"
                      : "#111827 !important",
                },
                "&.Mui-selected": {
                  backgroundColor: "#3FA90C !important",
                  color: "#FFFFFF",
                  "&:hover": { backgroundColor: "#2ea04c !important" },
                },
                "&.MuiPickersDay-today": { borderRadius: "50%" },
              },
            },
          },
          MuiPickersToolbar: {
            styleOverrides: {
              root: {
                backgroundColor: "#3FA90C",
                color: "#FFFFFF",
                minHeight: "60px",
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontWeight: 900,
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: { margin: 0, maxWidth: "320px", width: "100%" },
            },
          },
        },
      }),
    [theme]
  );

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <div className="flex items-center justify-center w-full">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            value={internalValue}
            onChange={handleChange}
            closeOnSelect
            disableFuture={disableFuture}
            toolbarFormat="YYYY - ddd, MMM DD"
            format="DD/MM/YYYY" // 👈 Added this line to control visible format
            onOpen={() => {
              const active = document.activeElement;
              if (active instanceof HTMLElement) {
                active.blur();
              }
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
                label,
                placeholder: label,
                InputProps: {
                  readOnly: true,
                  onKeyDown: (e: React.KeyboardEvent) => e.preventDefault(),
                },
              },
              actionBar: { actions: [] },
              toolbar: { toolbarPlaceholder: "", toolbarTitle: "" },
            }}
          />
        </LocalizationProvider>
      </div>
    </ThemeProvider>
  );
};

export default CustomDatePicker;
