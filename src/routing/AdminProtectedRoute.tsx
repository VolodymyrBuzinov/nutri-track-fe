import localLoader from "@/assets/local-loader.svg";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { Navigate } from "react-router-dom";
import { routes } from "./routes";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  path: string;
  isPublic?: boolean;
}

export const AdminProtectedRoute = ({
  children,
  isPublic = false,
}: AdminProtectedRouteProps) => {
  const { data: admin, isPending } = useCurrentAdmin(!isPublic);
  console.log(admin, "admin");

  if (isPending && !isPublic) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img src={localLoader} alt="Loading" className="size-12" />
      </div>
    );
  }

  if (!admin && !isPublic) {
    return <Navigate to={routes.admin_login} replace />;
  }

  if (admin && isPublic) {
    return <Navigate to={routes.admin_users} replace />;
  }

  return children;
};
