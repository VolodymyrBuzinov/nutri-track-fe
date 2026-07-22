import { LoginPage } from "@/pages/LoginPage";
import { routes } from "./routes";

export const routesData = {
  home: {
    path: routes.home,
    component: <></>,
  },
  login: {
    path: routes.login,
    component: LoginPage,
  },
  profile: {
    path: routes.profile,
    component: <></>,
  },
  admin_dashboard: {
    path: routes.admin_dashboard,
    component: <></>,
  },
  admin_user: {
    path: routes.admin_user,
    component: <></>,
  },
  admin_meal: {
    path: routes.admin_meal,
    component: <></>,
  },
};
