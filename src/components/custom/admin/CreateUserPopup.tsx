import { adminApi, adminQueryKeys } from "@/api/admin/admin-api";
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
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toast } from "@/components/ui/toast";
import { handleApiError } from "@/lib/utils";
import { createUserSchema, type CreateUserSchema } from "@/lib/validation";
import { queryClient } from "@/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, LockKeyhole, Mail, UserIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
    control,
    handleSubmit,
    reset,
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
      toast.add({
        title: "Користувача успішно створено",
        type: "success",
      });
    },
    onError: handleApiError,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
      setIsPasswordVisible(false);
    }

    onOpenChange(nextOpen);
  };

  const onSubmit = (data: CreateUserSchema) => {
    createUser(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-user-name">Ім'я</FieldLabel>
                  <InputGroup aria-invalid={fieldState.invalid}>
                    <InputGroupInput
                      {...field}
                      id="create-user-name"
                      type="text"
                      placeholder="Введіть ім'я"
                      autoComplete="name"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon>
                      <UserIcon className="size-4" aria-hidden="true" />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-user-email">
                    Електронна пошта
                  </FieldLabel>
                  <InputGroup aria-invalid={fieldState.invalid}>
                    <InputGroupInput
                      {...field}
                      id="create-user-email"
                      type="email"
                      placeholder="Введіть електронну пошту"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon>
                      <Mail className="size-4" aria-hidden="true" />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-user-password">Пароль</FieldLabel>
                  <InputGroup aria-invalid={fieldState.invalid}>
                    <InputGroupInput
                      {...field}
                      id="create-user-password"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Введіть пароль"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon>
                      <LockKeyhole className="size-4" aria-hidden="true" />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        aria-label={
                          isPasswordVisible
                            ? "Приховати пароль"
                            : "Показати пароль"
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
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
