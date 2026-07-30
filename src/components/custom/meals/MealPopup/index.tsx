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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
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
          <FieldGroup className="sm:grid-cols-2">
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="meal-name">Назва</FieldLabel>
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
              {errors.name && <FieldError errors={[errors.name]} />}
            </Field>

            <Controller
              control={control}
              name="type"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="meal-type">Тип</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="meal-type"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue className="capitalize" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="сніданок">Сніданок</SelectItem>
                      <SelectItem value="обід">Обід</SelectItem>
                      <SelectItem value="вечеря">Вечеря</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Field data-invalid={Boolean(errors.description)}>
            <FieldLabel htmlFor="meal-description">Опис</FieldLabel>
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
            {errors.description && (
              <FieldError errors={[errors.description]} />
            )}
          </Field>

          <FieldGroup className="sm:grid-cols-2">
            <Field data-invalid={Boolean(errors.image)}>
              <div className="flex items-center gap-1.5">
                <FieldLabel htmlFor="meal-image">Зображення</FieldLabel>
                <InfoPopover
                  content="Завантажте зображення у форматі JPG, PNG або WebP розміром до 5 МБ. Воно буде додано, оновлено чи вилучено лише після збереження страви."
                  label="Інформація: Зображення"
                />
              </div>
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
                <FieldDescription>
                  Зображення буде вилучено після збереження.
                </FieldDescription>
              ) : null}
              {errors.image && <FieldError errors={[errors.image]} />}
            </Field>

            <Field data-invalid={Boolean(errors.slug)}>
              <FieldLabel htmlFor="meal-slug">Slug</FieldLabel>
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
              {errors.slug && <FieldError errors={[errors.slug]} />}
            </Field>
          </FieldGroup>

          <FieldSet className="rounded-xl border border-border p-4">
            <FieldLegend>Поживна цінність</FieldLegend>
            <div className="grid grid-cols-2 gap-4">
              {nutritionFields.map(({ name, label, suffix }) => {
                const fieldError = errors.composition?.[name];
                const inputId = `meal-${name}`;

                return (
                  <Field key={name} data-invalid={Boolean(fieldError)}>
                    <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
                    <div className="relative">
                      <Input
                        id={inputId}
                        type="number"
                        min="0"
                        step="any"
                        className="pr-10"
                        aria-invalid={Boolean(fieldError)}
                        {...register(`composition.${name}`, {
                          valueAsNumber: true,
                        })}
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-content-muted">
                        {suffix}
                      </span>
                    </div>
                    {fieldError && <FieldError errors={[fieldError]} />}
                  </Field>
                );
              })}
            </div>
          </FieldSet>

          <FieldSet
            aria-label="Продукти"
            className="gap-3 rounded-xl border border-border p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <FieldTitle className="text-sm font-semibold">
                Продукти
              </FieldTitle>
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
                <Field
                  className="col-span-6"
                  data-invalid={Boolean(
                    errors.composition?.products?.[index]?.name
                  )}
                >
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
                  {errors.composition?.products?.[index]?.name && (
                    <FieldError
                      errors={[errors.composition.products[index].name]}
                    />
                  )}
                </Field>
                <Field
                  className="col-span-3"
                  data-invalid={Boolean(
                    errors.composition?.products?.[index]?.count
                  )}
                >
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
                  {errors.composition?.products?.[index]?.count && (
                    <FieldError
                      errors={[errors.composition.products[index].count]}
                    />
                  )}
                </Field>
                <Field
                  className="col-span-2"
                  data-invalid={Boolean(
                    errors.composition?.products?.[index]?.unit
                  )}
                >
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
                  {errors.composition?.products?.[index]?.unit && (
                    <FieldError
                      errors={[errors.composition.products[index].unit]}
                    />
                  )}
                </Field>
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
            {errors.composition?.products?.message && (
              <FieldError errors={[errors.composition.products]} />
            )}
          </FieldSet>

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

