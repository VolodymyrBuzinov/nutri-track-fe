/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Error {
  error: {
    message: string;
    code: string;
    fields?: Record<string, string>;
  };
}

export interface LoginRequest {
  /** @format email */
  email: string;
  /**
   * @format password
   * @minLength 8
   * @maxLength 20
   * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}<>\\|;:'\",.?/~`_+=-]).{8,}$
   */
  password: string;
}

export interface User {
  /** @format uuid */
  id: string;
  name: string;
  /** @format email */
  email: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt?: string | null;
  age: number;
  weight: number;
  gender: "чоловік" | "жінка" | "";
  height: number;
  activityLevel: "малий" | "середній" | "високий" | "";
  avatarUrl: string;
}

export interface UpdateUserRequest {
  name?: string;
  age?: number;
  weight?: number;
  gender?: "чоловік" | "жінка" | "";
  height?: number;
  activityLevel?: "малий" | "середній" | "високий" | "";
}

export interface MealProduct {
  name: string;
  count: number;
  unit: string;
}

export interface MealComposition {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  products: MealProduct[];
}

export interface Meal {
  /** @format uuid */
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
  type: "сніданок" | "обід" | "вечеря";
  composition: MealComposition;
}

export interface CreateMealRequest {
  /** @minLength 1 */
  name: string;
  /** @minLength 1 */
  description: string;
  /** @minLength 1 */
  imageUrl: string;
  /** @minLength 1 */
  slug: string;
  type: "сніданок" | "обід" | "вечеря";
  composition: MealComposition;
}

export interface UpdateMealRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  type?: "сніданок" | "обід" | "вечеря";
  composition?: {
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
    products?: MealProduct[];
  };
}

export interface MealPlanRequest {
  /** @format uuid */
  userId: string;
  /**
   * @format date
   * @example "2026-07-17"
   */
  date: string;
  /** @minItems 1 */
  meals: string[];
}

export interface MealPlan {
  /** @format uuid */
  id: string;
  /** @format uuid */
  userId: string;
  /** @format date */
  date: string;
  meals: Meal[];
}

export interface DashboardProgress {
  calories: NutrientProgress;
  protein: NutrientProgress;
  carbohydrates: NutrientProgress;
  fat: NutrientProgress;
}

export interface NutrientProgress {
  consumed: number;
  remaining: number;
}

export interface Dashboard {
  progress: DashboardProgress | null;
  recommendedMeals: Meal[];
}

export interface Admin {
  /** @format uuid */
  id: string;
  /** @format email */
  email: string;
  name: string;
  /** @format date-time */
  createdAt: string;
  role: string;
}

export interface AdminLoginUser {
  /** @format email */
  email: string;
  name: string;
  role: "admin";
}

export interface CreateUserRequest {
  /** @minLength 1 */
  name: string;
  /** @format email */
  email: string;
  password: string;
}

export interface GetUserParams {
  /** User identifier. */
  userId: string;
}

export interface UpdateUserParams {
  /** User identifier. */
  userId: string;
}

/** @format binary */
export type UploadUserAvatarPayload = File;

export interface UploadUserAvatarParams {
  /** User identifier. */
  userId: string;
}

export interface DeleteUserAvatarParams {
  /** User identifier. */
  userId: string;
}

export interface GetMealsParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface GetMealParams {
  /** Meal identifier. */
  id: string;
}

export interface GetMealPlanParams {
  /**
   * Calendar date in yyyy-MM-dd format.
   * @format date
   * @example "2026-07-17"
   */
  date?: string;
  /** User identifier. */
  userId: string;
}

export interface UpdateMealPlanParams {
  /** Meal plan identifier. */
  planId: string;
}

export interface ResetMealPlanParams {
  /** Meal plan identifier. */
  planId: string;
}

export interface GetDashboardParams {
  /**
   * Calendar date in yyyy-MM-dd format.
   * @format date
   * @example "2026-07-17"
   */
  date: string;
  /** User identifier. */
  userId: string;
}

export interface AdminGetUsersParams {
  sortBy?: "name";
  sortOrder?: "asc" | "desc";
  /** @format email */
  email?: string;
}

export interface AdminGetUserParams {
  /** User identifier. */
  userId: string;
}

export interface AdminDeleteUserParams {
  /** User identifier. */
  userId: string;
}

export interface AdminGetMealsParams {
  sortBy?: "name" | "type";
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface AdminGetMealParams {
  /** Meal identifier. */
  mealId: string;
}

export interface AdminUpdateMealParams {
  /** Meal identifier. */
  mealId: string;
}

export interface AdminDeleteMealParams {
  /** Meal identifier. */
  mealId: string;
}

/** @format binary */
export type AdminUploadMealImagePayload = File;

export interface AdminUploadMealImageParams {
  /** Meal slug. */
  mealSlug: string;
}

/** @format binary */
export type AdminUpdateMealImagePayload = File;

export interface AdminUpdateMealImageParams {
  /** Meal slug. */
  mealSlug: string;
}

export interface AdminDeleteMealImageParams {
  /** Meal slug. */
  mealSlug: string;
}
