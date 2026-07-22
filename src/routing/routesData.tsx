import { AdminProtectedRoute } from "@/routing/AdminProtectedRoute";
import { UserProtectedRoute } from "@/routing/UserProtectedRoute";
import { lazy, type ReactNode } from "react";
import { routes } from "./routes";

// Route configuration intentionally keeps its lazy page declaration colocated.
// eslint-disable-next-line react-refresh/only-export-components
const LoginPage = lazy(() =>
  import("../pages/LoginPage").then(({ LoginPage }) => ({
    default: LoginPage,
  }))
);

interface AppRoute {
  path: string;
  element: ReactNode;
}

export const routesData: AppRoute[] = [
  {
    path: routes.home,
    element: <UserProtectedRoute>{null}</UserProtectedRoute>,
  },
  {
    path: routes.login,
    element: <LoginPage />,
  },
  {
    path: routes.profile,
    element: <UserProtectedRoute>{null}</UserProtectedRoute>,
  },
  {
    path: routes.admin_dashboard,
    element: <AdminProtectedRoute>{null}</AdminProtectedRoute>,
  },
  {
    path: routes.admin_user,
    element: <AdminProtectedRoute>{null}</AdminProtectedRoute>,
  },
  {
    path: routes.admin_meal,
    element: <AdminProtectedRoute>{null}</AdminProtectedRoute>,
  },
];
