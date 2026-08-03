import { AdminProtectedRoute } from "@/routing/AdminProtectedRoute";
import { UserProtectedRoute } from "@/routing/UserProtectedRoute";
import { lazy, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { routes } from "./routes";
import { AdminPublicRoute } from "./AdminPublicRoute";
import { UserPublicRoute } from "./UserPublicRoute";

const LoginPage = lazy(() =>
  import("../pages/LoginPage").then(({ LoginPage }) => ({
    default: LoginPage,
  }))
);

const UserDashboard = lazy(() =>
  import("../pages/user/UserDashboard").then(({ UserDashboard }) => ({
    default: UserDashboard,
  }))
);

const UserProfile = lazy(() =>
  import("../pages/user/UserProfile").then(({ UserProfile }) => ({
    default: UserProfile,
  }))
);

const AdminUsers = lazy(() =>
  import("../pages/admin/AdminUsers").then(({ AdminUsers }) => ({
    default: AdminUsers,
  }))
);

const AdminMeals = lazy(() =>
  import("../pages/admin/AdminMeals").then(({ AdminMeals }) => ({
    default: AdminMeals,
  }))
);

const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage").then(({ NotFoundPage }) => ({
    default: NotFoundPage,
  }))
);

interface AppRoute {
  path: string;
  element: ReactNode;
}

export const routesData: AppRoute[] = [
  {
    path: routes.home,
    element: <Navigate to={routes.login} replace />,
  },
  {
    path: routes.login,
    element: (
      <UserPublicRoute>
        <LoginPage />
      </UserPublicRoute>
    ),
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
    path: routes.user_dashboard,
    element: (
      <UserProtectedRoute path={routes.user_dashboard}>
        <UserDashboard />
      </UserProtectedRoute>
    ),
  },
  {
    path: routes.user_profile,
    element: (
      <UserProtectedRoute path={routes.user_profile}>
        <UserProfile />
      </UserProtectedRoute>
    ),
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
