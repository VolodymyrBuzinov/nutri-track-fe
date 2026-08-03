import { Loader } from "@/components/custom/shared/Loader";
import { useAuth } from "@/context/authContext";
import type { ReactNode } from "react";
import { routes } from "./routes";
import { Navigate } from "react-router-dom";

interface UserProtectedRouteProps {
  children: ReactNode;
  isPending?: boolean;
  path: string;
}

export const UserProtectedRoute = ({
  children,
  isPending,
  path,
}: UserProtectedRouteProps) => {
  const { currentUser } = useAuth();
  if (isPending) return <Loader />;

  if (currentUser?.account === null && path !== routes.login) {
    return <Navigate to={routes.login} replace />;
  }

  return children;
};
