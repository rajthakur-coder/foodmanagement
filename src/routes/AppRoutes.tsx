// import React, { useState, useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// // Route Guards
// import RoleBasedRoute from "./RoleBasedRoute";
// import RoleHomeRedirect from "./RoleHomeRedirect";

// // Common
// import UnauthorizedPage from "../pages/Auth/UnauthorizedPage";
// import Preloader from "../components/Common/Preloader";
// import PageWrapper from "../components/Common/TitleManager";
// import LayoutWrapper from "../components/layout/LayoutWrapper";

// // Auth
// import SignInForm from "../pages/Auth/SignInForm";

// // User Pages
// import Menu from "../pages/User/Menu/menu";
// import AddToCart from "../pages/User/Menu/AddToCart";
// import OrderHistory from "../pages/User/Menu/OrderHistory";
// import QREntry from "../pages/Public/QREntry";

// const AppRoutes: React.FC = () => {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setIsLoading(false), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   if (isLoading) return <Preloader />;

//   return (
//     <Routes>
//       {/* ---------- Public Routes ---------- */}
//       <Route
//         path="/qr-entry"
//         element={
//           <PageWrapper title="QR Entry">
//             <QREntry />
//           </PageWrapper>
//         }
//       />
//       <Route
//         path="/auth/customer/login"
//         element={
//           <PageWrapper title="Login">
//             <SignInForm />
//           </PageWrapper>
//         }
//       />
//       <Route
//         path="/error/404"
//         element={
//           <PageWrapper title="Unauthorized">
//             <UnauthorizedPage />
//           </PageWrapper>
//         }
//       />

//       {/* ---------- Protected Routes ---------- */}
//       <Route element={<LayoutWrapper />}>
//         {/* Home redirect based on role */}
//         <Route path="/" element={<RoleHomeRedirect />} />

//         {/* ---------- Guest & User Routes ---------- */}
//         <Route element={<RoleBasedRoute allowedRoles={["Guest"]} />}>
//           <Route
//             path="/menu"
//             element={
//               <PageWrapper title="Menu">
//                 <Menu />
//               </PageWrapper>
//             }
//           />
//           <Route
//             path="/add-to-cart"
//             element={
//               <PageWrapper title="Add To Cart">
//                 <AddToCart  />
//               </PageWrapper>
//             }
//           />
//           <Route
//             path="/myOrder"
//             element={
//               <PageWrapper title="My Orders">
//                 <OrderHistory />
//               </PageWrapper>
//             }
//           />
//         </Route>
//       </Route>

//       {/* ---------- Catch All ---------- */}
//       <Route path="*" element={<Navigate to="/error/404" replace />} />
//     </Routes>
//   );
// };

// export default AppRoutes;












import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Route Guards
import RoleBasedRoute from "./RoleBasedRoute";
import RoleHomeRedirect from "./RoleHomeRedirect";

// Common
import Preloader from "../components/Common/Preloader";
import PageWrapper from "../components/Common/TitleManager";
import LayoutWrapper from "../components/layout/LayoutWrapper";

/* ================================
   Lazy Loaded Pages
================================ */

const UnauthorizedPage = lazy(
  () => import("../pages/Auth/UnauthorizedPage")
);
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Preloader />;

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

        <Route
          path="/auth/customer/login"
          element={
            <PageWrapper title="Login">
              <SignInForm />
            </PageWrapper>
          }
        />

        <Route
          path="/error/404"
          element={
            <PageWrapper title="Unauthorized">
              <UnauthorizedPage />
            </PageWrapper>
          }
        />

        {/* ---------- Protected Routes ---------- */}
        <Route element={<LayoutWrapper />}>
          {/* Home redirect based on role */}
          <Route path="/" element={<RoleHomeRedirect />} />

          {/* ---------- Guest & User Routes ---------- */}
          <Route element={<RoleBasedRoute allowedRoles={["Guest"]} />}>
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

            <Route
              path="/myOrder"
              element={
                <PageWrapper title="My Orders">
                  <OrderHistory />
                </PageWrapper>
              }
            />
          </Route>
        </Route>

        {/* ---------- Catch All ---------- */}
        <Route path="*" element={<Navigate to="/error/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

