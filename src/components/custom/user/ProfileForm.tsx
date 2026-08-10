import { userApi, userQueryKeys } from "@/api/user/user-api";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/context/authContext";
import { cn, handleApiError, noDoubleBlanksFilter } from "@/lib/utils";
import {
  profileSchema,
  type ProfileFormInput,
  type ProfileSchema,
} from "@/lib/validation";
import { queryClient } from "@/queryClient";
import type { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const parametersFields = [
  { name: "age", label: "Вік", suffix: "років" },
  { name: "weight", label: "Вага", suffix: "кг" },
  { name: "height", label: "Зріст", suffix: "см" },
] as const;

const getDefaultValues = (user: User): ProfileFormInput => ({
  name: user.name,
  age: user.age > 0 ? user.age : undefined,
  weight: user.weight > 0 ? user.weight : undefined,
  height: user.height > 0 ? user.height : undefined,
  gender: user.gender ?? "",
});

const isProfileFieldFilled = (value: unknown) =>
  typeof value === "number"
    ? Number.isFinite(value) && value > 0
    : typeof value === "string" && value.trim().length > 0;

const isProfileComplete = (profile: ProfileFormInput) =>
  (["age", "weight", "gender", "height"] as const).every((field) =>
    isProfileFieldFilled(profile[field])
  );

export const ProfileForm = () => {
  const { setCurrentUser, currentUser } = useAuth();
  const user = currentUser.account as User;

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormInput, undefined, ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: getDefaultValues(user),
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: ({ data }) => {
      const updatedUser = data.data;
      setCurrentUser(updatedUser);
      queryClient.setQueryData([userQueryKeys.getUser], {
        type: "user",
        account: updatedUser,
      });
      queryClient.invalidateQueries({
        queryKey: [userQueryKeys.getDashboardData],
      });
      reset(getDefaultValues(updatedUser));
      toast.add({
        title: "Профіль успішно оновлено",
        type: "success",
      });
    },
    onError: handleApiError,
  });

  useEffect(() => {
    reset(getDefaultValues(user));
  }, [reset, user]);

  const onSubmit = (data: ProfileSchema) => {
    updateProfile(data);
  };

  const watchedProfile = watch();
  const isComplete = isProfileComplete(watchedProfile);

  return (
    <section
      aria-labelledby="profile-form-title"
      className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6 flex-1 min-w-80"
    >
      <div className=" flex flex-wrap justify-between items-center gap-2 mb-6">
        <h2
          id="profile-form-title"
          className="font-heading text-lg font-semibold text-content"
        >
          Особисті дані
        </h2>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
            isComplete
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          )}
        >
          {isComplete ? (
            <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          )}
          {isComplete ? (
            <span>Дані профілю повністю заповнені</span>
          ) : (
            <span>Заповніть дані профілю</span>
          )}
        </span>
      </div>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Field data-invalid={Boolean(errors.name)} className="mb-4">
          <FieldLabel htmlFor="profile-name">Ім&apos;я</FieldLabel>
          <Input
            id="profile-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            {...register("name", {
              onChange: (event) => {
                event.target.value = noDoubleBlanksFilter(event.target.value);
              },
            })}
          />
          {errors.name ? <FieldError errors={[errors.name]} /> : null}
        </Field>

        <FieldGroup className="grid grid-cols-2 gap-4">
          {parametersFields.map(({ name, label, suffix }) => {
            const fieldError = errors[name];
            const inputId = `profile-${name}`;

            return (
              <Controller
                key={name}
                name={name}
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
                    <div className="relative">
                      <Input
                        id={inputId}
                        type="number"
                        min="0"
                        step="any"
                        className="pr-12"
                        aria-invalid={fieldState.invalid}
                        value={
                          field.value === undefined || field.value === null
                            ? ""
                            : String(field.value)
                        }
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                        }}
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-content-muted">
                        {suffix}
                      </span>
                    </div>
                    {fieldError ? <FieldError errors={[fieldError]} /> : null}
                  </Field>
                )}
              />
            );
          })}

          <Controller
            name="gender"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profile-gender">Стать</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="profile-gender"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue
                      className="capitalize"
                      placeholder="Оберіть стать"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="жінка">Жінка</SelectItem>
                    <SelectItem value="чоловік">Чоловік</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="flex gap-3 mt-6 justify-end">
          <Button
            type="button"
            variant="secondary"
            disabled={isPending || !isDirty}
            onClick={() => reset(getDefaultValues(user))}
          >
            Скасувати
          </Button>
          <Button type="submit" disabled={isPending || !isDirty}>
            {isPending ? "Збереження..." : "Зберегти зміни"}
          </Button>
        </div>
      </form>
    </section>
  );
};
