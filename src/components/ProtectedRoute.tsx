import { Navigate } from "react-router";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const userData = localStorage.getItem("user");
  
  if (!userData) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
} 