import localLoader from "@/assets/local-loader.svg";
import { Navigate } from "react-router-dom";
import { routes } from "./routes";
import { useAuth } from "@/context/authContext";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  path: string;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { authStatus } = useAuth();

  if (authStatus === "unknown") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img src={localLoader} alt="Loading" className="size-12" />
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return <Navigate to={routes.admin_login} replace />;
  }

  return children;
};
