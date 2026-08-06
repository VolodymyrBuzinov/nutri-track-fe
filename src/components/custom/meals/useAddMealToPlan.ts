import { userApi, userQueryKeys } from "@/api/user/user-api";
import { toast } from "@/components/ui/toast";
import { TODAY } from "@/lib/consts";
import { handleApiError } from "@/lib/utils";
import { queryClient } from "@/queryClient";
import type { MealPlan } from "@/types";
import { useMutation } from "@tanstack/react-query";

const onSuccess = () => {
  queryClient.invalidateQueries({
    queryKey: [userQueryKeys.getDashboardData],
  });
  toast.add({
    title: "Страва додана до плану харчування",
    type: "success",
  });
};

export const useAddMealToPlan = () => {
  const { mutate: createMealPlan, isPending: isCreatingMealPlan } = useMutation(
    {
      mutationFn: userApi.createMealPlan,
      onError: handleApiError,
      onSuccess: (res) => {
        queryClient.setQueryData([userQueryKeys.getMealsPlan, TODAY], res);
        onSuccess();
      },
    }
  );

  const { mutate: updateMealPlan, isPending: isUpdatingMealPlan } = useMutation(
    {
      mutationFn: userApi.updateMealPlan,
      onSuccess: (res) => {
        queryClient.setQueryData([userQueryKeys.getMealsPlan, TODAY], res);
        onSuccess();
      },
      onError: handleApiError,
    }
  );

  const handleAddMeal = (mealId: string) => {
    const mealPlan = queryClient.getQueryData<{ data: { data: MealPlan } }>([
      userQueryKeys.getMealsPlan,
      TODAY,
    ])?.data?.data;

    if (mealPlan) {
      return updateMealPlan({
        planId: mealPlan.id,
        date: mealPlan.date,
        meals: [mealId],
      });
    }

    createMealPlan({ date: TODAY, meals: [mealId] });
  };

  return {
    handleAddMeal,
    isPending: isCreatingMealPlan || isUpdatingMealPlan,
  };
};
