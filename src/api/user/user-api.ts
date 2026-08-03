import type {
  Dashboard,
  GetDashboardParams,
  LoginRequest,
  User,
} from "@/types";
import { userApiCall, type ApiResponse } from "../api";

export const userQueryKeys = {
  getUser: "user",
  getDashboardData: "dashboard",
};

const USER_API_PREFIX = "/users";

export const userApi = {
  getUser: () => {
    return userApiCall<ApiResponse<User>>({
      url: `${USER_API_PREFIX}/me`,
      method: "GET",
    });
  },
  getDashboardData: (params: GetDashboardParams) => {
    return userApiCall<ApiResponse<Dashboard>>({
      url: `${USER_API_PREFIX}/dashboard`,
      method: "GET",
      config: {
        params,
      },
    });
  },
};

export const userAuthApi = {
  login: (data: LoginRequest) => {
    return userApiCall<ApiResponse<User>>({
      url: `${USER_API_PREFIX}/auth/login`,
      method: "POST",
      data,
    });
  },
  refresh: () => {
    return userApiCall<void>({
      url: `${USER_API_PREFIX}/auth/refresh-token`,
      method: "POST",
    });
  },
  logout: () => {
    return userApiCall<void>({
      url: `${USER_API_PREFIX}/auth/logout`,
      method: "POST",
    });
  },
};
