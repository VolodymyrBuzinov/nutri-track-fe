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

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
    products: meal?.composition.products ?? [{ name: "", count: 0, unit: "г" }],
  },
});

interface UseMealPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal?: Meal;
}

interface MealImageMutationVariables {
  image: File;
  mealSlug: string;
}

interface UpdateMealMutationVariables {
  data: UpdateMealRequest;
  mealId: string;
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

  const { mutateAsync: createMeal } = useMutation({
    mutationFn: adminApi.createMeal,
  });
  const { mutateAsync: updateMeal } = useMutation({
    mutationFn: ({ mealId, data }: UpdateMealMutationVariables) =>
      adminApi.updateMeal(mealId, data),
  });
  const { mutateAsync: uploadMealImage } = useMutation({
    mutationFn: ({ mealSlug, image }: MealImageMutationVariables) =>
      adminApi.uploadMealImage(mealSlug, image),
  });
  const { mutateAsync: updateMealImage } = useMutation({
    mutationFn: ({ mealSlug, image }: MealImageMutationVariables) =>
      adminApi.updateMealImage(mealSlug, image),
  });
  const { mutateAsync: deleteMealImage } = useMutation({
    mutationFn: adminApi.deleteMealImage,
  });

  const { mutateAsync: saveMeal, isPending } = useMutation({
    mutationFn: async (data: MealSchema) => {
      const { image, ...mealData } = data;

      if (!meal) {
        if (!image) {
          return;
        }

        const { data: uploadResponse } = await uploadMealImage({
          mealSlug: mealData.slug,
          image,
        });
        await createMeal({
          ...mealData,
          imageUrl: uploadResponse.data.imageUrl,
        });
        return;
      }

      const updateData: UpdateMealRequest = {
        name: mealData.name,
        description: mealData.description,
        type: mealData.type,
        composition: mealData.composition,
      };

      if (isImageMarkedForDeletion) {
        await deleteMealImage(meal.slug);
        await updateMeal({
          mealId: meal.id,
          data: { ...updateData, imageUrl: "" },
        });
        return;
      }

      if (image) {
        const { data: uploadResponse } = await updateMealImage({
          mealSlug: meal.slug,
          image,
        });
        await updateMeal({
          mealId: meal.id,
          data: {
            ...updateData,
            imageUrl: uploadResponse.data.imageUrl,
          },
        });
        return;
      }

      await updateMeal({ mealId: meal.id, data: updateData });
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

  const onSubmit = async (data: MealSchema) => {
    if (!isEditing && !data.image) {
      setError("image", { message: "Виберіть файл зображення" });
      return;
    }

    await saveMeal(data);
  };

  const handleImageChange = (file?: File) => {
    if (file && !ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
      setError("image", {
        message: "Оберіть зображення у форматі JPG, PNG або WebP",
      });
      return false;
    }

    if (file && file.size > MAX_IMAGE_SIZE_BYTES) {
      setError("image", {
        message: "Розмір зображення не повинен перевищувати 5 МБ",
      });
      return false;
    }

    setValue("image", file, { shouldValidate: true });
    setIsImageMarkedForDeletion(false);
    setImagePreviewUrl(file ? URL.createObjectURL(file) : meal?.imageUrl);
    setImageFileName(file?.name);
    clearErrors("image");
    return true;
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
    removeProduct: remove,
    ALLOWED_IMAGE_MIME_TYPES,
  };
};
