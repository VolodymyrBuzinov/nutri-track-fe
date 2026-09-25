import type { GetMealsParams, Meal } from "@/types";
import { userApiCall, type ApiResponse } from "../api";

export const mealsQueryKeys = {
  getMeals: "meals",
  getMeal: "meal",
  getProducts: "meal-products",
  searchByProducts: "search-meals-by-products",
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

  getProducts: () => {
    return userApiCall<ApiResponse<string[]>>({
      url: `${MEALS_API_PREFIX}/products`,
      method: "GET",
    });
  },

  getMealsByProducts: (products: string[]) => {
    return userApiCall<ApiResponse<Meal[]>>({
      url: `${MEALS_API_PREFIX}/search-by-products`,
      method: "GET",
      config: {
        params: { products },
      },
    });
  },

  getMeal: (slug: string) => {
    return userApiCall<ApiResponse<Meal>>({
      url: `${MEALS_API_PREFIX}/${slug}`,
      method: "GET",
    });
  },
};
