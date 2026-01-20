
import React, { JSX, Suspense, lazy } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./components/app/store";
const AppRoutes = lazy(() => import("./routes/AppRoutes"));
import { ThemeProvider as AppThemeProvider } from "./components/context/ThemeContext";
import AuthListener from "./component/AuthListener";
import ProgressWatcher from "./components/ui/ProgressWatcher";
import Preloader from "./components/Common/Preloader";
import { GlobalLoaderProvider } from "./components/ui/GlobalLoader";
import NetworkStatus from "./pages/Auth/NetworkStatus";

// Material UI
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

// Toaster Config
import { TOASTER_LIBRARY } from "./components/Config/toaster.config";
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";
import { ToastContainer } from "react-toastify";
import "./assets/styles/scss/globals.scss";

/* ------------------------------
    Create Global MUI Theme
------------------------------ */
const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1C252E" },
    background: { default: "#F9FAFB", paper: "#FFFFFF" },
    text: { primary: "#111827", secondary: "#6B7280" },
  },
  typography: { fontSize: 13 },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "0.75rem",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          transition: "all 0.2s ease",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9e9e9e",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1C252E",
            borderWidth: "2px",
          },
        },
        notchedOutline: { borderColor: "#D1D5DB" },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#6B7280",
          fontWeight: 500,
          transition: "all 0.2s ease",
          "&.Mui-focused": { color: "#1C252E" },
        },
      },
    },
  },
});

/* ------------------------------
     AppContent (Core Logic)
------------------------------ */
const AppContent: React.FC = () => {
  const { isAuthenticated, isGlobalLoggingOut } = useSelector(
    (state: RootState) => state.auth
  );


  return (
    <Router>
      <AuthListener />
      <NetworkStatus />
      {isGlobalLoggingOut ? (
        <Preloader />
      ) : (
        <GlobalLoaderProvider>
          <ProgressWatcher />
           <Suspense fallback={<Preloader />}>
              <AppRoutes />
          </Suspense>

          {/* === 🪄 Toaster Providers === */}
          {TOASTER_LIBRARY === "hot-toast" && (
            <HotToaster
              position="top-center"
              toastOptions={{ style: { zIndex: 99999 } }}
            />
          )}

          {TOASTER_LIBRARY === "sonner" && (
            <SonnerToaster
              position="top-center"
              theme="dark"
              richColors
              toastOptions={{ style: { zIndex: 99999 } }}
            />
          )}

          {TOASTER_LIBRARY === "toastify" && (
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar
              closeButton={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              style={{ zIndex: 99999 }}
            />
          )}
        </GlobalLoaderProvider>
      )}
    </Router>
  );
};

/* ------------------------------
 AppWrapper (Top-Level)
------------------------------ */
const AppWrapper: React.FC = () => (
  <AppThemeProvider>
    <MUIThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppContent />
    </MUIThemeProvider>
  </AppThemeProvider>
);

export default AppWrapper;



