import React from "react";
import { Navigate } from "react-router-dom";

const RoleHomeRedirect = () => {
  const sessionRole = sessionStorage.getItem("user_type");

  if (sessionRole === "Guest") {
    return <Navigate to="/menu" replace />;
  }

  return <Navigate to="/auth/customer/login" replace />;
};

export default RoleHomeRedirect;
