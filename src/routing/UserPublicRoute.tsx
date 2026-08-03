import { useAuth } from "@/context/authContext";
import { routes } from "./routes";
import { Navigate } from "react-router-dom";
import { Loader } from "@/components/custom/shared/Loader";

interface UserPublicRouteProps {
  children: React.ReactNode;
}
export const UserPublicRoute = ({ children }: UserPublicRouteProps) => {
  const { currentUser, isPending } = useAuth();
  if (isPending) return <Loader />;

  if (currentUser?.account) {
    return <Navigate to={routes.user_dashboard} replace />;
  }

  return children;
};
