import type { Admin, AdminGetUsersParams, LoginRequest, User } from "@/types";
import { adminApiCall } from "../api";

export const adminQeryKeys = {
  get_users: "admin-get-users",
  get_user: "admin-get-user",
  get_meals: "admin-get-meals",
  get_meal: "admin-get-meal",
};

const ADMIN_API_PREFIX = "/admin";

export const adminApi = {
  getAdmin: () =>
    adminApiCall<Admin>({
      url: ADMIN_API_PREFIX,
      method: "GET",
    }),
  getUsers: (params: AdminGetUsersParams) =>
    adminApiCall<User[]>({
      url: `${ADMIN_API_PREFIX}/users`,
      method: "GET",
      config: {
        params,
      },
    }),
};

export const adminAuthApi = {
  login: (data: LoginRequest) =>
    adminApiCall<Admin>({
      url: `${ADMIN_API_PREFIX}/auth/login`,
      method: "POST",
      data,
    }),
  logout: () =>
    adminApiCall<void>({
      url: `${ADMIN_API_PREFIX}/auth/logout`,
      method: "POST",
    }),
  refresh: () =>
    adminApiCall<void>({
      url: `${ADMIN_API_PREFIX}/auth/refresh-token`,
      method: "POST",
    }),
};
