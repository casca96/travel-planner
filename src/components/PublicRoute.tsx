import { Navigate } from "react-router";

type PublicRouteProps = {
  children: React.ReactNode;
};

export default function PublicRoute({ children }: PublicRouteProps) {
  const userData = localStorage.getItem("user");
  
  if (userData) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
} 