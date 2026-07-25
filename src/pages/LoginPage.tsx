import { adminAuthApi } from "@/api/admin/admin-api";
import { userAuthApi } from "@/api/user/user-api";
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
import { routes } from "@/routing/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
import { useNavigate } from "react-router-dom";

const labelStyles = "text-sm font-medium mb-2 block";

interface LoginPageProps {
  isAdmin?: boolean;
}

export const LoginPage = ({ isAdmin = false }: LoginPageProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

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

  const { isPending: isAdminLoginPending, mutate: adminLogin } = useMutation({
    mutationFn: adminAuthApi.login,
    onSuccess: () => {
      navigate(routes.admin_dashboard);
    },
  });

  const { mutate: userLogin, isPending: isUserLoginPending } = useMutation({
    mutationFn: userAuthApi.login,
    onSuccess: () => {
      navigate(routes.user_dashboard);
    },
  });

  const onSubmit = (data: LoginSchema) => {
    if (isAdmin) {
      adminLogin(data);
    } else {
      userLogin(data);
    }
  };

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

        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={isAdminLoginPending || isUserLoginPending}
        >
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
