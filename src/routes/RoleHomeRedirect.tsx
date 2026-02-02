


import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import type { RootState } from "../components/app/store";
import Preloader from "../components/Common/Preloader";

const RoleHomeRedirect: React.FC = () => {
  const token = Cookies.get("customertoken");
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  // ⏳ token hai but user abhi load ho raha hai
  if (token && isLoading) {
    return <Preloader />;
  }

  if (!token) {
    return <Navigate to="/auth/customer/login" replace />;
  }

  if (!user) {
    return <Navigate to="/menu" replace />; // safe fallback
  }

  switch (user.role) {
    case "Guest":
      return <Navigate to="/menu" replace />;
    default:
      return <Navigate to="/menu" replace />;
  }
};


export default RoleHomeRedirect;
