import { ErrorMessage } from "@/components/custom/shared/ErrorMessage";
import { InfoPopover } from "@/components/custom/shared/InfoPopover";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { noDoubleBlanksFilter, slugFilter } from "@/lib/utils";
import { Image, Plus, Trash2, Upload } from "lucide-react";
import type { Meal } from "@/types";
import { Controller } from "react-hook-form";
import { useMealPopup } from "./useMealPopup";

const labelStyles = "mb-2 block text-sm font-medium";

const nutritionFields = [
  { name: "calories", label: "Калорії", suffix: "ккал" },
  { name: "protein", label: "Білки", suffix: "г" },
  { name: "fat", label: "Жири", suffix: "г" },
  { name: "carbohydrates", label: "Вуглеводи", suffix: "г" },
] as const;

interface MealPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal?: Meal;
}

export const MealPopup = ({ open, onOpenChange, meal }: MealPopupProps) => {
  const {
    appendProduct,
    control,
    errors,
    fields,
    handleImageChange,
    handleSubmit,
    imageFileName,
    imagePreviewUrl,
    isEditing,
    isImageMarkedForDeletion,
    isPending,
    markImageForDeletion,
    onSubmit,
    register,
    removeProduct,
    ALLOWED_IMAGE_MIME_TYPES,
  } = useMealPopup({ open, onOpenChange, meal });
  const title = isEditing ? "Редагувати страву" : "Створити страву";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-x-hidden overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Заповніть основну інформацію та поживну цінність страви.
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid min-w-0 gap-5"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <FormField
              error={errors.name?.message}
              id="meal-name"
              label="Назва"
            >
              <Input
                id="meal-name"
                placeholder="Введіть назву страви"
                aria-invalid={Boolean(errors.name)}
                {...register("name", {
                  onChange: (event) => {
                    event.target.value = noDoubleBlanksFilter(
                      event.target.value
                    );
                  },
                })}
              />
            </FormField>

            <FormField error={errors.type?.message} id="meal-type" label="Тип">
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="meal-type"
                      aria-invalid={Boolean(errors.type)}
                    >
                      <SelectValue className="capitalize" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="сніданок">Сніданок</SelectItem>
                      <SelectItem value="обід">Обід</SelectItem>
                      <SelectItem value="вечеря">Вечеря</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
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
              {...register("description", {
                onChange: (event) => {
                  event.target.value = noDoubleBlanksFilter(event.target.value);
                },
              })}
            />
          </FormField>

          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <FormField
              error={errors.image?.message}
              id="meal-image"
              label="Зображення"
              info="Завантажте зображення у форматі JPG, PNG або WebP розміром до 5 МБ. Воно буде додано, оновлено чи вилучено лише після збереження страви."
            >
              <div>
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt={meal?.name ? `Зображення ${meal.name}` : ""}
                    className="size-16 shrink-0 rounded-lg border border-border object-cover"
                  />
                ) : (
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-content-muted">
                    <Image className="size-5" aria-hidden="true" />
                  </div>
                )}
                <div className="mt-3">
                  <Input
                    id="meal-image"
                    type="file"
                    accept={ALLOWED_IMAGE_MIME_TYPES.join(",")}
                    className="sr-only"
                    onChange={(event) => {
                      if (!handleImageChange(event.target.files?.[0])) {
                        event.target.value = "";
                      }
                    }}
                  />
                  <label
                    htmlFor="meal-image"
                    className="inline-flex h-10 max-w-full cursor-pointer items-center gap-2 rounded-md border border-main px-3 text-sm font-medium text-main transition-colors hover:bg-main-soft focus-within:ring-2 focus-within:ring-main/30"
                  >
                    <Upload className="size-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">
                      {imageFileName ?? "Вибрати файл"}
                    </span>
                  </label>
                </div>
                {isEditing && imagePreviewUrl ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={markImageForDeletion}
                  >
                    <Trash2 aria-hidden="true" />
                    Вилучити
                  </Button>
                ) : null}
              </div>
              {isImageMarkedForDeletion ? (
                <p className="mt-2 text-xs text-content-muted">
                  Зображення буде вилучено після збереження.
                </p>
              ) : null}
            </FormField>

            <FormField error={errors.slug?.message} id="meal-slug" label="Slug">
              <Input
                id="meal-slug"
                placeholder="nazva-stravi"
                disabled={isEditing}
                aria-invalid={Boolean(errors.slug)}
                {...register("slug", {
                  onChange: (event) => {
                    event.target.value = slugFilter(event.target.value);
                  },
                })}
              />
            </FormField>
          </div>

          <fieldset className="grid min-w-0 gap-4 rounded-xl border border-border p-4">
            <legend className="px-1 text-sm font-semibold">
              Поживна цінність
            </legend>
            <div className="grid grid-cols-2 gap-4">
              {nutritionFields.map(({ name, label, suffix }) => {
                const error = errors.composition?.[name]?.message;
                const inputId = `meal-${name}`;

                return (
                  <div key={name} className="min-w-0">
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

          <fieldset className="grid min-w-0 gap-3 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <legend className="text-sm font-semibold">Продукти</legend>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={appendProduct}
              >
                <Plus aria-hidden="true" />
                Додати
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="grid min-w-0 grid-cols-12 gap-2">
                <div className="col-span-6 min-w-0">
                  <Input
                    placeholder="Назва продукту"
                    aria-label={`Назва продукту ${index + 1}`}
                    aria-invalid={Boolean(
                      errors.composition?.products?.[index]?.name
                    )}
                    {...register(`composition.products.${index}.name`, {
                      onChange: (event) => {
                        event.target.value = noDoubleBlanksFilter(
                          event.target.value
                        );
                      },
                    })}
                  />
                  <ErrorMessage
                    id={`meal-product-${index}-name-error`}
                    message={
                      errors.composition?.products?.[index]?.name?.message
                    }
                  />
                </div>
                <div className="col-span-3 min-w-0">
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
                    message={
                      errors.composition?.products?.[index]?.count?.message
                    }
                  />
                </div>
                <div className="col-span-2 min-w-0">
                  <Input
                    placeholder="г"
                    aria-label={`Одиниця виміру продукту ${index + 1}`}
                    aria-invalid={Boolean(
                      errors.composition?.products?.[index]?.unit
                    )}
                    {...register(`composition.products.${index}.unit`, {
                      onChange: (event) => {
                        event.target.value = noDoubleBlanksFilter(
                          event.target.value
                        );
                      },
                    })}
                  />
                  <ErrorMessage
                    id={`meal-product-${index}-unit-error`}
                    message={
                      errors.composition?.products?.[index]?.unit?.message
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="col-span-1"
                  aria-label={`Вилучити продукт ${index + 1}`}
                  disabled={fields.length === 1}
                  onClick={() => removeProduct(index)}
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
  info?: string;
  label: string;
}

const FormField = ({ children, error, id, info, label }: FormFieldProps) => (
  <div className="min-w-0">
    <div className="mb-2 flex items-center gap-1.5">
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      {info ? (
        <InfoPopover content={info} label={`Інформація: ${label}`} />
      ) : null}
    </div>
    {children}
    <ErrorMessage id={`${id}-error`} message={error} />
  </div>
);
