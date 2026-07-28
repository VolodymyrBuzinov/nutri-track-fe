import { useAuth } from "@/context/authContext";
import { routes } from "./routes";
import { Navigate } from "react-router-dom";
import { Loader } from "@/components/custom/Loader";

interface AdminPublicRouteProps {
  children: React.ReactNode;
}
export const AdminPublicRoute = ({ children }: AdminPublicRouteProps) => {
  const { currentUser, isPending } = useAuth();
  if (isPending) return <Loader />;
  if (currentUser?.account) {
    return <Navigate to={routes.admin_users} replace />;
  }

  return children;
};
