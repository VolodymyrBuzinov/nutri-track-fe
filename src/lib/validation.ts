import { z } from "zod";

const passwordValidation = z
  .string()
  .min(1, "Пароль є обов'язковим")
  .min(8, "Пароль повинен містити щонайменше 8 символів")
  .max(20, "Пароль повинен містити щонайбільше 20 символів")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}<>\\|;:'",.?/~`_+=-]).{8,}$/,
    "Пароль повинен містити малу й велику літери, цифру та спеціальний символ"
  );

const emailValidation = z
  .email("Неправильний email")
  .min(1, "Email є обов'язковим");

const nameValidation = z
  .string()
  .min(1, "Ім'я є обов'язковим")
  .max(20, "Ім'я повинен містити щонайбільше 20 символів");

export const loginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const createUserSchema = z.object({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

const mealTypeValidation = z.enum(["сніданок", "обід", "вечеря"], {
  message: "Оберіть тип страви",
});

const nutritionValueValidation = z.coerce
  .number("Вкажіть числове значення")
  .min(0, "Значення не може бути від'ємним");

export const mealSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Назва страви є обов'язковою")
    .max(100, "Назва повинна містити щонайбільше 100 символів"),
  description: z
    .string()
    .trim()
    .min(1, "Опис страви є обов'язковим")
    .max(1_000, "Опис повинен містити щонайбільше 1000 символів"),
  imageUrl: z.url("Вкажіть коректне посилання на зображення"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug є обов'язковим")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug може містити лише малі латинські літери, цифри та дефіси"
    ),
  type: mealTypeValidation,
  composition: z.object({
    calories: nutritionValueValidation,
    protein: nutritionValueValidation,
    fat: nutritionValueValidation,
    carbohydrates: nutritionValueValidation,
    products: z
      .array(
        z.object({
          name: z.string().trim().min(1, "Вкажіть назву продукту"),
          count: z.coerce
            .number("Вкажіть кількість")
            .positive("Кількість повинна бути більшою за нуль"),
          unit: z.string().trim().min(1, "Вкажіть одиницю виміру"),
        })
      )
      .min(1, "Додайте принаймні один продукт"),
  }),
});

export type MealFormInput = z.input<typeof mealSchema>;
export type MealSchema = z.infer<typeof mealSchema>;
