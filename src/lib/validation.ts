import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Неправильний email").min(1, "Email є обов'язковим"),
  password: z
    .string()
    .min(1, "Пароль є обов'язковим")
    .min(8, "Пароль повинен містити щонайменше 8 символів")
    .max(20, "Пароль повинен містити щонайбільше 20 символів")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}<>\\|;:'",.?/~`_+=-]).{8,}$/,
      "Пароль повинен містити малу й велику літери, цифру та спеціальний символ"
    ),
});

export type LoginSchema = z.infer<typeof loginSchema>;
