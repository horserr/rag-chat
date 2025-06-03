import React from "react";
import { Navigate } from "react-router-dom";
import useAuthCheck from "../../hooks/auth/useAuthCheck";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

// const LoadingIndicator = () => (
//   <Box
//     sx={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       height: "100vh",
//     }}
//   >
//     <CircularProgress />
//   </Box>
// );

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Use the optimized useAuthCheck hook
  const { data: hasToken } = useAuthCheck();

  // Once check is complete, either show children or redirect
  return hasToken ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
