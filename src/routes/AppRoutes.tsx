

import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Route Guards
import RoleBasedRoute from "./RoleBasedRoute";
import RoleHomeRedirect from "./RoleHomeRedirect";

// Common
import Preloader from "../components/Common/Preloader";
import PageWrapper from "../components/Common/TitleManager";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import ViewBill from "../pages/User/Menu/ViewBill"
/* ---------- Lazy Pages ---------- */

const SignInForm = lazy(
  () => import("../pages/Auth/SignInForm")
);
const QREntry = lazy(
  () => import("../pages/Public/QREntry")
);

// User Pages
const Menu = lazy(() => import("../pages/User/Menu/menu"));
const AddToCart = lazy(
  () => import("../pages/User/Menu/AddToCart")
);
const OrderHistory = lazy(
  () => import("../pages/User/Menu/OrderHistory")
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Preloader />}>
      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route
          path="/qr-entry"
          element={
            <PageWrapper title="QR Entry">
              <QREntry />
            </PageWrapper>
          }
        />
        {/* Catch-all for QR entry → stay on /qr-entry */}
        <Route path="/qr-entry/*" element={<Navigate to="/qr-entry" replace />} />

        <Route
          path="/auth/customer/login"
          element={
            <PageWrapper title="Login">
              <SignInForm />
            </PageWrapper>
          }
        />
        {/* Catch-all for login → stay on /auth/customer/login */}
        <Route path="/auth/customer/login/*" element={<Navigate to="/auth/customer/login" replace />} />

        {/* ---------- Protected Routes ---------- */}
        <Route element={<LayoutWrapper />}>
          {/* Role-based home redirect */}
          <Route path="/" element={<RoleHomeRedirect />} />

          {/* Guest Routes */}
          <Route
            path="/menu"
            element={
              <PageWrapper title="Menu">
                <Menu />
              </PageWrapper>
            }
          />

          <Route
            path="/cart"
            element={
              <PageWrapper title="Cart">
                <AddToCart />
              </PageWrapper>
            }
          />

          <Route element={<RoleBasedRoute allowedRoles={["Guest"]} />}>

          
          <Route
            path="/view-bill"
            element={
              <PageWrapper title="VIEW BILL">
                <ViewBill />
              </PageWrapper>
            }
          />
            <Route
              path="/myOrder"
              element={
                <PageWrapper title="My Orders">
                  <OrderHistory />
                </PageWrapper>
              }
            />
          </Route>

          {/* Catch-all for PROTECTED routes → redirect to /menu */}
          <Route path="*" element={<Navigate to="/menu" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
