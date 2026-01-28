// // import { Navigate, Outlet } from "react-router-dom";
// // import Preloader from "../components/Common/Preloader";

// // const RoleBasedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
// //   // Sirf session se role check hoga
// //   const role = sessionStorage.getItem("user_type"); // "Guest"

// //   // ⏳ Session abhi set nahi hua (QR redirect ke time)
// //   if (role === null) {
// //     return <Preloader />;
// //   }

// //   // ✅ Allowed role (Guest)
// //   if (allowedRoles.includes(role)) {
// //     return <Outlet />;
// //   }

// //   // 🚫 Unauthorized
// //   return <Navigate to="/error/404" replace />;
// // };

// // export default RoleBasedRoute;






// import { Navigate, Outlet } from "react-router-dom";

// const RoleBasedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
//   const role = sessionStorage.getItem("user_type"); // "Guest"

//   // ❌ Loader mat dikhao (session reactive nahi)
//   if (!role) {
//     return <Navigate to="/qr-entry" replace />;
//   }

//   if (!allowedRoles.includes(role)) {
//     return <Navigate to="/error/404" replace />;
//   }

//   return <Outlet />;
// };

// export default RoleBasedRoute;








import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import type { RootState } from "../components/app/store";

const RoleBasedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const token = Cookies.get("customertoken"); // ✅ real auth
  const user = useSelector((state: RootState) => state.auth.user);

  // ❌ Not logged in
  if (!token || !user) {
    return <Navigate to="/auth/customer/login" replace />;
  }

  // ❌ Role mismatch
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/error/404" replace />;
  }

  // ✅ Access allowed
  return <Outlet />;
};

export default RoleBasedRoute;
