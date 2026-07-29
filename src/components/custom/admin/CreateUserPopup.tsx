import { adminApi, adminQueryKeys } from "@/api/admin/admin-api";
import { ErrorMessage } from "@/components/custom/shared/ErrorMessage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { createUserSchema, type CreateUserSchema } from "@/lib/validation";
import { queryClient } from "@/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, LockKeyhole, Mail, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const labelStyles = "text-sm font-medium mb-2 block";

interface CreateUserPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateUserPopup = ({
  open,
  onOpenChange,
}: CreateUserPopupProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({
        queryKey: [adminQueryKeys.get_users],
      });
      setIsPasswordVisible(false);
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
      setIsPasswordVisible(false);
    }
  }, [open, reset]);

  const onSubmit = (data: CreateUserSchema) => {
    createUser(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Створити користувача</DialogTitle>
          <DialogDescription>
            Заповніть дані для нового облікового запису користувача.
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-4"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className={labelStyles} htmlFor="create-user-name">
              Ім'я
            </label>
            <InputGroup aria-invalid={Boolean(errors.name)}>
              <InputGroupInput
                id="create-user-name"
                type="text"
                placeholder="Введіть ім'я"
                autoComplete="name"
                aria-describedby={
                  errors.name ? "create-user-name-error" : undefined
                }
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
              <InputGroupAddon>
                <UserIcon className="size-4" aria-hidden="true" />
              </InputGroupAddon>
            </InputGroup>
            {errors.name && (
              <ErrorMessage
                id="create-user-name-error"
                message={errors.name.message}
              />
            )}
          </div>

          <div>
            <label className={labelStyles} htmlFor="create-user-email">
              Електронна пошта
            </label>
            <InputGroup aria-invalid={Boolean(errors.email)}>
              <InputGroupInput
                id="create-user-email"
                type="email"
                placeholder="Введіть електронну пошту"
                autoComplete="email"
                aria-describedby={
                  errors.email ? "create-user-email-error" : undefined
                }
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              <InputGroupAddon>
                <Mail className="size-4" aria-hidden="true" />
              </InputGroupAddon>
            </InputGroup>
            {errors.email && (
              <ErrorMessage
                id="create-user-email-error"
                message={errors.email.message}
              />
            )}
          </div>

          <div>
            <label className={labelStyles} htmlFor="create-user-password">
              Пароль
            </label>
            <InputGroup aria-invalid={Boolean(errors.password)}>
              <InputGroupInput
                id="create-user-password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Введіть пароль"
                autoComplete="new-password"
                aria-describedby={
                  errors.password ? "create-user-password-error" : undefined
                }
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
                  onClick={() =>
                    setIsPasswordVisible((isVisible) => !isVisible)
                  }
                >
                  {isPasswordVisible ? <EyeOff /> : <Eye />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {errors.password && (
              <ErrorMessage
                id="create-user-password-error"
                message={errors.password.message}
              />
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Відміна
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Створення..." : "Створити"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
