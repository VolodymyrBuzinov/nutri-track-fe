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
