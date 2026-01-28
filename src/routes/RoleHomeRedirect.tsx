// import React from "react";
// import { Navigate } from "react-router-dom";

// const RoleHomeRedirect = () => {
//   const sessionRole = sessionStorage.getItem("user_type");

//   if (sessionRole === "Guest") {
//     return <Navigate to="/menu" replace />;
//   }

//   return <Navigate to="/auth/customer/login" replace />;
// };

// export default RoleHomeRedirect;










import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import type { RootState } from "../components/app/store";

const RoleHomeRedirect: React.FC = () => {
  const token = Cookies.get("customertoken"); // check auth
  const user = useSelector((state: RootState) => state.auth.user); // get user from Redux

  // Not logged in → redirect to login
  if (!token || !user) {
    return <Navigate to="/auth/customer/login" replace />;
  }

  // Logged in → redirect based on role
  switch (user.role) {
    case "Guest":
      return <Navigate to="/menu" replace />;
    case "PlatformAdmin":
      return <Navigate to="/admin/dashboard" replace />; // example
    case "RestaurantStaff":
      return <Navigate to="/staff/dashboard" replace />; // example
    default:
      return <Navigate to="/auth/customer/login" replace />;
  }
};

export default RoleHomeRedirect;
