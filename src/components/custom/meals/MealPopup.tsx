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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { handleApiError } from "@/lib/utils";
import {
  mealSchema,
  type MealFormInput,
  type MealSchema,
} from "@/lib/validation";
import { queryClient } from "@/queryClient";
import type { Meal, UpdateMealRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Image, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const labelStyles = "mb-2 block text-sm font-medium";

const nutritionFields = [
  { name: "calories", label: "Калорії", suffix: "ккал" },
  { name: "protein", label: "Білки", suffix: "г" },
  { name: "fat", label: "Жири", suffix: "г" },
  { name: "carbohydrates", label: "Вуглеводи", suffix: "г" },
] as const;

const getDefaultValues = (meal?: Meal): MealFormInput => ({
  name: meal?.name ?? "",
  description: meal?.description ?? "",
  imageUrl: meal?.imageUrl ?? "",
  slug: meal?.slug ?? "",
  type: meal?.type ?? "сніданок",
  composition: {
    calories: meal?.composition.calories ?? 0,
    protein: meal?.composition.protein ?? 0,
    fat: meal?.composition.fat ?? 0,
    carbohydrates: meal?.composition.carbohydrates ?? 0,
    products: meal?.composition.products ?? [
      { name: "", count: 0, unit: "г" },
    ],
  },
});

interface MealPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal?: Meal;
}

export const MealPopup = ({ open, onOpenChange, meal }: MealPopupProps) => {
  const isEditing = Boolean(meal);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MealFormInput, undefined, MealSchema>({
    resolver: zodResolver(mealSchema),
    defaultValues: getDefaultValues(meal),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "composition.products",
  });

  const { mutate: saveMeal, isPending } = useMutation({
    mutationFn: (data: MealSchema) => {
      if (!meal) return adminApi.createMeal(data);

      const { slug: _, ...updateData } = data;
      return adminApi.updateMeal(meal.id, updateData as UpdateMealRequest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [adminQueryKeys.get_meals],
      });
      onOpenChange(false);
      toast.add({
        title: isEditing
          ? "Страву успішно оновлено"
          : "Страву успішно створено",
        type: "success",
      });
    },
    onError: handleApiError,
  });

  useEffect(() => {
    if (!open) return;

    reset(getDefaultValues(meal));
  }, [meal, open, reset]);

  const onSubmit = (data: MealSchema) => saveMeal(data);
  const title = isEditing ? "Редагувати страву" : "Створити страву";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Заповніть основну інформацію та поживну цінність страви.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-5" noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              error={errors.name?.message}
              id="meal-name"
              label="Назва"
            >
              <Input
                id="meal-name"
                placeholder="Наприклад, Вівсянка з ягодами"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
            </FormField>

            <FormField error={errors.type?.message} id="meal-type" label="Тип">
              <select
                id="meal-type"
                className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm outline-none focus-visible:border-main focus-visible:ring-2 focus-visible:ring-main/20 aria-invalid:border-destructive"
                aria-invalid={Boolean(errors.type)}
                {...register("type")}
              >
                <option value="сніданок">Сніданок</option>
                <option value="обід">Обід</option>
                <option value="вечеря">Вечеря</option>
              </select>
            </FormField>
          </div>

          <FormField
            error={errors.description?.message}
            id="meal-description"
            label="Опис"
          >
            <Textarea
              id="meal-description"
              placeholder="Коротко опишіть страву"
              aria-invalid={Boolean(errors.description)}
              {...register("description")}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              error={errors.imageUrl?.message}
              id="meal-image-url"
              label="Посилання на зображення"
            >
              <div className="relative">
                <Input
                  id="meal-image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="pr-10"
                  aria-invalid={Boolean(errors.imageUrl)}
                  {...register("imageUrl")}
                />
                <Image
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-content-muted"
                  aria-hidden="true"
                />
              </div>
            </FormField>

            <FormField error={errors.slug?.message} id="meal-slug" label="Slug">
              <Input
                id="meal-slug"
                placeholder="vivianka-z-yagodami"
                disabled={isEditing}
                aria-invalid={Boolean(errors.slug)}
                {...register("slug")}
              />
            </FormField>
          </div>

          <fieldset className="grid gap-4 rounded-xl border border-border p-4">
            <legend className="px-1 text-sm font-semibold">Поживна цінність</legend>
            <div className="grid grid-cols-2 gap-4">
              {nutritionFields.map(({ name, label, suffix }) => {
                const error = errors.composition?.[name]?.message;
                const inputId = `meal-${name}`;

                return (
                  <div key={name}>
                    <label className={labelStyles} htmlFor={inputId}>
                      {label}
                    </label>
                    <div className="relative">
                      <Input
                        id={inputId}
                        type="number"
                        min="0"
                        step="any"
                        className="pr-10"
                        aria-invalid={Boolean(error)}
                        {...register(`composition.${name}`, {
                          valueAsNumber: true,
                        })}
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-content-muted">
                        {suffix}
                      </span>
                    </div>
                    <ErrorMessage id={`${inputId}-error`} message={error} />
                  </div>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="grid gap-3 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <legend className="text-sm font-semibold">Продукти</legend>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", count: 0, unit: "г" })}
              >
                <Plus aria-hidden="true" />
                Додати
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-2">
                <div className="col-span-6">
                  <Input
                    placeholder="Назва продукту"
                    aria-label={`Назва продукту ${index + 1}`}
                    aria-invalid={Boolean(
                      errors.composition?.products?.[index]?.name
                    )}
                    {...register(`composition.products.${index}.name`)}
                  />
                  <ErrorMessage
                    id={`meal-product-${index}-name-error`}
                    message={errors.composition?.products?.[index]?.name?.message}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="К-сть"
                    aria-label={`Кількість продукту ${index + 1}`}
                    aria-invalid={Boolean(
                      errors.composition?.products?.[index]?.count
                    )}
                    {...register(`composition.products.${index}.count`, {
                      valueAsNumber: true,
                    })}
                  />
                  <ErrorMessage
                    id={`meal-product-${index}-count-error`}
                    message={errors.composition?.products?.[index]?.count?.message}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    placeholder="г"
                    aria-label={`Одиниця виміру продукту ${index + 1}`}
                    aria-invalid={Boolean(
                      errors.composition?.products?.[index]?.unit
                    )}
                    {...register(`composition.products.${index}.unit`)}
                  />
                  <ErrorMessage
                    id={`meal-product-${index}-unit-error`}
                    message={errors.composition?.products?.[index]?.unit?.message}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="col-span-1"
                  aria-label={`Вилучити продукт ${index + 1}`}
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            ))}
            <ErrorMessage
              id="meal-products-error"
              message={errors.composition?.products?.message}
            />
          </fieldset>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Відміна
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditing
                  ? "Збереження..."
                  : "Створення..."
                : isEditing
                  ? "Зберегти"
                  : "Створити"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  id: string;
  label: string;
}

const FormField = ({ children, error, id, label }: FormFieldProps) => (
  <div>
    <label className={labelStyles} htmlFor={id}>
      {label}
    </label>
    {children}
    <ErrorMessage id={`${id}-error`} message={error} />
  </div>
);
