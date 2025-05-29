import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuthCheck } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const LoadingIndicator = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress />
  </Box>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Use the optimized useAuthCheck hook
  const { data: authData, isLoading } = useAuthCheck();

  // While checking auth status, show loading indicator
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // Once check is complete, either show children or redirect
  return authData?.isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
