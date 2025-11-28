import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { Navigate, useLocation } from "react-router-dom";
import { logout } from "../store/authSlice";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  // If there is a token but no user in the store, clear token and force login.
  useEffect(() => {
    if (token && !user) {
      localStorage.removeItem("token");
      dispatch(logout());
    }
  }, [token, user, dispatch]);

  return token && user ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;


