import type { GetMealsParams, Meal } from "@/types";
import { userApiCall, type ApiResponse } from "../api";

export const mealsQueryKeys = {
  getMeals: "meals",
  getMeal: "meal",
};

const MEALS_API_PREFIX = "/meals";

export const mealsApi = {
  getMeals: (params: GetMealsParams) => {
    return userApiCall<ApiResponse<Meal[]>>({
      url: `${MEALS_API_PREFIX}`,
      method: "GET",
      config: {
        params,
      },
    });
  },
  getMeal: (id: string) => {
    return userApiCall<ApiResponse<Meal>>({
      url: `${MEALS_API_PREFIX}/${id}`,
      method: "GET",
    });
  },
};
