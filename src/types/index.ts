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
