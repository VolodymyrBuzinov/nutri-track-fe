import type {
  Admin,
  AdminGetMealsParams,
  AdminGetUsersParams,
  LoginRequest,
  Meal,
  User,
} from "@/types";
import { adminApiCall, type ApiResponse } from "../api";

export const adminQueryKeys = {
  current_admin: "current-admin",
  get_users: "admin-get-users",
  get_user: "admin-get-user",
  get_meals: "admin-get-meals",
  get_meal: "admin-get-meal",
};

const ADMIN_API_PREFIX = "/admin";

export const adminApi = {
  getAdmin: () =>
    adminApiCall<ApiResponse<Admin>>({
      url: `${ADMIN_API_PREFIX}/me`,
      method: "GET",
    }),
  getUsers: (params: AdminGetUsersParams) =>
    adminApiCall<ApiResponse<User[]>>({
      url: `${ADMIN_API_PREFIX}/users`,
      method: "GET",
      config: {
        params,
      },
    }),
  getMeals: (params: AdminGetMealsParams) =>
    adminApiCall<ApiResponse<Meal[]>>({
      url: `${ADMIN_API_PREFIX}/meals`,
      method: "GET",
      config: {
        params,
      },
    }),
};

export const adminAuthApi = {
  login: (data: LoginRequest) =>
    adminApiCall<ApiResponse<Admin>>({
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
