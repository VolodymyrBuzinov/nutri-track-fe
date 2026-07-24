import type { LoginRequest, User } from "@/types";
import { userApiCall } from "../api";

export const UserQueryKeys = {
  getUser: ["user"],
} as const;

const USER_API_PREFIX = "/users";

export const userApi = {
  getUser: () => {
    return userApiCall<User>({
      url: USER_API_PREFIX,
      method: "GET",
    });
  },
};

export const userAuthApi = {
  login: (data: LoginRequest) => {
    return userApiCall<User>({
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
