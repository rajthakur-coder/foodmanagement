import React, { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../components/app/store";

import AuthListener from "../component/AuthListener";
import NetworkStatus from "../pages/Auth/NetworkStatus";
import ProgressWatcher from "../components/ui/ProgressWatcher";
import Preloader from "../components/Common/Preloader";
import { GlobalLoaderProvider } from "../components/ui/GlobalLoader";

import { TOASTER_LIBRARY } from "../components/Config/toaster.config";
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";
import { ToastContainer } from "react-toastify";

const AppRoutes = lazy(() => import("../routes/AppRoutes"));

const AppLayout = () => {
  const { isGlobalLoggingOut } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <>
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

          {/* ---------- Toasters ---------- */}
          {TOASTER_LIBRARY === "hot-toast" && (
            <HotToaster position="top-center" />
          )}

          {TOASTER_LIBRARY === "sonner" && (
            <SonnerToaster position="top-center" richColors />
          )}

          {TOASTER_LIBRARY === "toastify" && (
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar
              newestOnTop
              closeOnClick
              pauseOnHover
              theme="colored"
            />
          )}
        </GlobalLoaderProvider>
      )}
    </>
  );
};

export default AppLayout;
