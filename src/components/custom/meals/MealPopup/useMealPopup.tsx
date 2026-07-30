import { adminApi, adminQueryKeys } from "@/api/admin/admin-api";
import { handleApiError } from "@/lib/utils";
import {
  mealSchema,
  type MealFormInput,
  type MealSchema,
} from "@/lib/validation";
import { toast } from "@/components/ui/toast";
import { queryClient } from "@/queryClient";
import type { Meal, UpdateMealRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const getDefaultValues = (meal?: Meal): MealFormInput => ({
  name: meal?.name ?? "",
  description: meal?.description ?? "",
  image: undefined,
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

interface UseMealPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal?: Meal;
}

export const useMealPopup = ({
  open,
  onOpenChange,
  meal,
}: UseMealPopupProps) => {
  const isEditing = Boolean(meal);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>();
  const [imageFileName, setImageFileName] = useState<string>();
  const [isImageMarkedForDeletion, setIsImageMarkedForDeletion] =
    useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    clearErrors,
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
    mutationFn: async (data: MealSchema) => {
      const { image, ...mealData } = data;

      if (!meal) {
        const createdMeal = await adminApi.createMeal(mealData);

        if (image) {
          await adminApi.uploadMealImage(createdMeal.data.data.slug, image);
        }

        return;
      }

      const { slug: _, ...updateData } = mealData;
      await adminApi.updateMeal(meal.id, updateData as UpdateMealRequest);

      if (isImageMarkedForDeletion) {
        await adminApi.deleteMealImage(meal.slug);
      } else if (image) {
        await adminApi.updateMealImage(meal.slug, image);
      }
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
    setImagePreviewUrl(meal?.imageUrl);
    setImageFileName(undefined);
    setIsImageMarkedForDeletion(false);
  }, [meal, open, reset]);

  useEffect(
    () => () => {
      if (imagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    },
    [imagePreviewUrl]
  );

  const onSubmit = (data: MealSchema) => {
    if (!isEditing && !data.image) {
      setError("image", { message: "Виберіть файл зображення" });
      return;
    }

    saveMeal(data);
  };

  const handleImageChange = (file?: File) => {
    setValue("image", file, { shouldValidate: true });
    setIsImageMarkedForDeletion(false);
    setImagePreviewUrl(file ? URL.createObjectURL(file) : meal?.imageUrl);
    setImageFileName(file?.name);
    clearErrors("image");
  };

  const markImageForDeletion = () => {
    setValue("image", undefined);
    setImagePreviewUrl(undefined);
    setImageFileName(undefined);
    setIsImageMarkedForDeletion(true);
    clearErrors("image");
  };

  return {
    appendProduct: () => append({ name: "", count: 0, unit: "г" }),
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
    removeProduct: remove,
  };
};
