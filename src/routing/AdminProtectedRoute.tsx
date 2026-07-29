import { Navigate } from "react-router-dom";
import { routes } from "./routes";
import { useAuth } from "@/context/authContext";
import { Loader } from "@/components/custom/shared/Loader";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  path: string;
}

export const AdminProtectedRoute = ({
  children,
  path,
}: AdminProtectedRouteProps) => {
  const { currentUser, isPending } = useAuth();
  if (isPending) return <Loader />;

  if (currentUser?.account === null && path !== routes.admin_login) {
    return <Navigate to={routes.admin_login} replace />;
  }

  return children;
};
