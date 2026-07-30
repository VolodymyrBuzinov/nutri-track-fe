import type {
  Admin,
  AdminGetMealsParams,
  AdminGetUsersParams,
  AdminUpdateMealImagePayload,
  AdminUploadMealImagePayload,
  CreateMealRequest,
  CreateUserRequest,
  LoginRequest,
  Meal,
  UpdateMealRequest,
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
  getUser: (userId: string) =>
    adminApiCall<ApiResponse<User>>({
      url: `${ADMIN_API_PREFIX}/users/${userId}`,
      method: "GET",
    }),
  createUser: (data: CreateUserRequest) =>
    adminApiCall<ApiResponse<User>>({
      url: `${ADMIN_API_PREFIX}/users`,
      method: "POST",
      data,
    }),

  getMeals: (params: AdminGetMealsParams) =>
    adminApiCall<ApiResponse<Meal[]>>({
      url: `${ADMIN_API_PREFIX}/meals`,
      method: "GET",
      config: {
        params,
      },
    }),
  getMeal: (mealId: string) =>
    adminApiCall<ApiResponse<Meal>>({
      url: `${ADMIN_API_PREFIX}/meals/${mealId}`,
      method: "GET",
    }),
  createMeal: (data: CreateMealRequest) =>
    adminApiCall<ApiResponse<Meal>>({
      url: `${ADMIN_API_PREFIX}/meals`,
      method: "POST",
      data,
    }),
  updateMeal: (mealId: string, data: UpdateMealRequest) =>
    adminApiCall<ApiResponse<Meal>>({
      url: `${ADMIN_API_PREFIX}/meals/${mealId}`,
      method: "PATCH",
      data,
    }),

  uploadMealImage: (mealSlug: string, data: AdminUploadMealImagePayload) =>
    adminApiCall<ApiResponse<{ imageUrl: string }>>({
      url: `${ADMIN_API_PREFIX}/meals/${mealSlug}/image`,
      method: "POST",
      data,
    }),
  updateMealImage: (mealSlug: string, data: AdminUpdateMealImagePayload) =>
    adminApiCall<ApiResponse<{ imageUrl: string }>>({
      url: `${ADMIN_API_PREFIX}/meals/${mealSlug}/image`,
      method: "PATCH",
      data,
    }),
  deleteMealImage: (mealSlug: string) =>
    adminApiCall<ApiResponse<void>>({
      url: `${ADMIN_API_PREFIX}/meals/${mealSlug}/image`,
      method: "DELETE",
    }),
  deleteMeal: (mealId: string) =>
    adminApiCall<ApiResponse<void>>({
      url: `${ADMIN_API_PREFIX}/meals/${mealId}`,
      method: "DELETE",
    }),
  deleteUser: (userId: string) =>
    adminApiCall<ApiResponse<void>>({
      url: `${ADMIN_API_PREFIX}/users/${userId}`,
      method: "DELETE",
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
