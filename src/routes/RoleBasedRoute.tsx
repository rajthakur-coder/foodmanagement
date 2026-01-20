import { Navigate, Outlet } from "react-router-dom";
import Preloader from "../components/Common/Preloader";

const RoleBasedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  // Sirf session se role check hoga
  const role = sessionStorage.getItem("user_type"); // "Guest"

  // ⏳ Session abhi set nahi hua (QR redirect ke time)
  if (role === null) {
    return <Preloader />;
  }

  // ✅ Allowed role (Guest)
  if (allowedRoles.includes(role)) {
    return <Outlet />;
  }

  // 🚫 Unauthorized
  return <Navigate to="/error/404" replace />;
};

export default RoleBasedRoute;
