export const routes = {
  home: "/",
  login: "/login",
  user_profile: "/profile",
  user_dashboard: "/dashboard",
  user_meal: (slug: string) => `/meals/${slug}`,
  user_meal_path: "/meals/:slug",
  //admin
  admin_login: "/admin/login",
  admin_users: "/admin/users",
  admin_meals: "/admin/meals",
};
