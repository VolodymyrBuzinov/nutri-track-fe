import { NotFoundPage } from "@/pages/NotFoundPage";
import { AdminProtectedRoute } from "@/routing/AdminProtectedRoute";
import { UserProtectedRoute } from "@/routing/UserProtectedRoute";
import { lazy, type ReactNode } from "react";
import { routes } from "./routes";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminPublicRoute } from "./AdminPublicRoute";
import { AdminMeals } from "@/pages/admin/AdminMeals";

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
    path: routes.login,
    element: <LoginPage />,
  },
  {
    path: routes.admin_login,
    element: (
      <AdminPublicRoute>
        <LoginPage isAdmin />
      </AdminPublicRoute>
    ),
  },
  {
    path: routes.profile,
    element: <UserProtectedRoute>{null}</UserProtectedRoute>,
  },
  {
    path: routes.admin_users,
    element: (
      <AdminProtectedRoute path={routes.admin_users}>
        <AdminUsers />
      </AdminProtectedRoute>
    ),
  },
  {
    path: routes.admin_meals,
    element: (
      <AdminProtectedRoute path={routes.admin_meals}>
        <AdminMeals />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
