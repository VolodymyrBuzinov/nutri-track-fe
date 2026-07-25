import { ErrorMessage } from "@/components/custom/ErrorMessage";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { AuthLayout } from "@/layouts/AuthLayout";
import type { LoginSchema } from "@/lib/validation";
import { loginSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const labelStyles = "text-sm font-medium mb-2 block";

export const LoginPage = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = () => undefined;

  return (
    <AuthLayout>
      <form
        className="flex-1 rounded-2xl bg-white p-8 shadow-lg w-85"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-heading text-32 font-semibold mb-2">Вітаємо!</h1>
        <p className="mb-4 text-content-muted">Увійдіть, щоб продовжити</p>

        <div>
          <label className={labelStyles} htmlFor="email">
            Електронна пошта
          </label>
          <InputGroup aria-invalid={Boolean(errors.email)}>
            <InputGroupInput
              id="email"
              type="email"
              placeholder="Введіть електронну пошту"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            <InputGroupAddon>
              <Mail className="size-4" aria-hidden="true" />
            </InputGroupAddon>
          </InputGroup>
          {errors.email && (
            <ErrorMessage id="email-error" message={errors.email.message} />
          )}
        </div>

        <div className="mt-4">
          <label className={labelStyles} htmlFor="password">
            Пароль
          </label>
          <InputGroup aria-invalid={Boolean(errors.password)}>
            <InputGroupInput
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Введіть пароль"
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            <InputGroupAddon>
              <LockKeyhole className="size-4" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label={
                  isPasswordVisible ? "Приховати пароль" : "Показати пароль"
                }
                aria-pressed={isPasswordVisible}
                onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
              >
                {isPasswordVisible ? <EyeOff /> : <Eye />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {errors.password && (
            <ErrorMessage
              id="password-error"
              message={errors.password.message}
            />
          )}
        </div>

        {/* <div className="mt-5 flex items-center justify-between gap-4 text-sm">
          <button type="button" className="font-medium text-main">
            Забули пароль?
          </button>
        </div> */}

        <Button type="submit" className="mt-6 w-full">
          Увійти
          <ArrowRight aria-hidden="true" />
        </Button>

        <p className="mt-7 flex items-center justify-center gap-2 border-t pt-5 text-sm text-content-muted">
          <ShieldCheck className="size-5 text-success" aria-hidden="true" />
          Безпечний доступ для користувачів
        </p>
      </form>
    </AuthLayout>
  );
};
