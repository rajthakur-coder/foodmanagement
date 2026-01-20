import React from "react";
import { Navigate } from "react-router-dom";

const RoleHomeRedirect = () => {
  const sessionRole = sessionStorage.getItem("user_type");

  // ✅ Only QR Guest allowed
  if (sessionRole === "Guest") {
    return <Navigate to="/menu" replace />;
  }

  // ❌ Everyone else → Login
  return <Navigate to="/auth/customer/login" replace />;
};

export default RoleHomeRedirect;
