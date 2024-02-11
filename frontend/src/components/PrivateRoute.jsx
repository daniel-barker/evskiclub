import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (userInfo) {
    return userInfo.isApproved ? (
      <Outlet />
    ) : (
      <Navigate to="/pending-approval" replace />
    );
  } else {
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;
