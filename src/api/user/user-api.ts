import type {
  Dashboard,
  GetDashboardParams,
  GetMealPlanParams,
  LoginRequest,
  MealPlan,
  MealPlanRequest,
  ResetMealPlanParams,
  UpdateMealPlanParams,
  User,
} from "@/types";
import { userApiCall, type ApiResponse } from "../api";

export const userQueryKeys = {
  getUser: "user",
  getDashboardData: "dashboard",
  getMealsPlan: "meals-plan",
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
  getMealsPlan: (params: GetMealPlanParams) => {
    return userApiCall<ApiResponse<MealPlan>>({
      url: `${USER_API_PREFIX}/meals-plan`,
      method: "GET",
      config: {
        params,
      },
    });
  },
  createMealPlan: (data: MealPlanRequest) => {
    return userApiCall<ApiResponse<MealPlan>>({
      url: `${USER_API_PREFIX}/meals-plan`,
      method: "POST",
      data,
    });
  },
  updateMealPlan: ({
    planId,
    date,
    meals,
  }: UpdateMealPlanParams & MealPlanRequest) => {
    return userApiCall<ApiResponse<MealPlan>>({
      url: `${USER_API_PREFIX}/meals-plan/${planId}`,
      method: "PUT",
      data: {
        date,
        meals,
      },
    });
  },
  resetMealPlan: ({ planId }: ResetMealPlanParams) => {
    return userApiCall<ApiResponse<MealPlan>>({
      url: `${USER_API_PREFIX}/meals-plan/${planId}/reset`,
      method: "PATCH",
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
