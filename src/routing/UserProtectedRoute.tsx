import type { ReactNode } from "react";

interface UserProtectedRouteProps {
  children: ReactNode;
}

export const UserProtectedRoute = ({ children }: UserProtectedRouteProps) => {
  return children;
};
