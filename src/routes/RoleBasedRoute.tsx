


import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import type { RootState } from "../components/app/store";

const RoleBasedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const token = Cookies.get("customertoken"); 
  const user = useSelector((state: RootState) => state.auth.user);

  if (!token || !user) {
    return <Navigate to="/auth/customer/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/error/404" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
