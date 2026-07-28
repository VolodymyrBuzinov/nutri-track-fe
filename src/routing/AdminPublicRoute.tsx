import { useAuth } from "@/context/authContext";
import localLoader from "@/assets/local-loader.svg";
import { routes } from "./routes";
import { Navigate } from "react-router-dom";

interface AdminPublicRouteProps {
  children: React.ReactNode;
}
export const AdminPublicRoute = ({ children }: AdminPublicRouteProps) => {
  const { currentUser, isPending } = useAuth();
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img src={localLoader} alt="Loading" className="size-12" />
      </div>
    );
  }
  if (currentUser?.account) {
    return <Navigate to={routes.admin_users} replace />;
  }

  return children;
};
