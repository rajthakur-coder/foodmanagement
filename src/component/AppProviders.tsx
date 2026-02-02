import React from "react";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider as AppThemeProvider } from "../components/context/ThemeContext";

const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1C252E" },
    background: { default: "#F9FAFB", paper: "#FFFFFF" },
    text: { primary: "#111827", secondary: "#6B7280" },
  },
  typography: { fontSize: 13 },
});

const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AppThemeProvider>
      <MUIThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </AppThemeProvider>
  );
};

export default AppProviders;
