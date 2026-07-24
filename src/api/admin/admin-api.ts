import type { Admin, AdminGetUsersParams, User } from "@/types";
import { apiCall } from "../api";

export const adminQeryKeys = {
  get_users: "admin-get-users",
  get_user: "admin-get-user",
  get_meals: "admin-get-meals",
  get_meal: "admin-get-meal",
};

const ADMIN_API_PREFIX = "/admin";

export const adminApi = {
  getAdmin: () =>
    apiCall<Admin>({
      url: ADMIN_API_PREFIX,
      method: "GET",
    }),
  getUsers: (params: AdminGetUsersParams) =>
    apiCall<User[]>({
      url: `${ADMIN_API_PREFIX}/users`,
      method: "GET",
      config: {
        params,
      },
    }),
};

export const adminAuthApi = {
  login: (email: string, password: string) =>
    apiCall<Admin>({
      url: `${ADMIN_API_PREFIX}/login`,
      method: "POST",
      data: { email, password },
    }),
  logout: () =>
    apiCall<void>({
      url: `${ADMIN_API_PREFIX}/logout`,
      method: "POST",
    }),
  refresh: (refreshToken: string) =>
    apiCall<Admin>({
      url: `${ADMIN_API_PREFIX}/refresh-token`,
      method: "POST",
      data: { refreshToken },
    }),
};
