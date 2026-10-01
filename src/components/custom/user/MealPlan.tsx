import { ConfirmationPopup } from "@/components/custom/shared/ConfirmationPopup";
import { MealCard } from "@/components/custom/meals/MealCard";
import { Button } from "@/components/ui/button";

import { userApi, userQueryKeys } from "@/api/user/user-api";
import { toast } from "@/components/ui/toast";
import { TODAY } from "@/lib/consts";
import { handleApiError } from "@/lib/utils";
import { queryClient } from "@/queryClient";
import type { Meal } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "../shared/Loader";

const mealSlots: Meal["type"][] = ["сніданок", "обід", "вечеря"];
const sectionStyles =
  "rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6 relative";
const planAriaLabel = "meal-plan-title";
const titleStyles = "font-heading text-lg font-semibold";
const cardWrapperStyles =
  "mt-4 flex flex-wrap gap-3 justify-center items-center min-h-100";

export const MealPlan = () => {
  const [idToRemove, setIdToRemove] = useState("");
  const [isResetConfirmationOpen, setIsResetConfirmationOpen] = useState(false);

  const { data: mealPlan, isPending } = useQuery({
    queryKey: [userQueryKeys.getMealsPlan, TODAY],
    queryFn: () => userApi.getMealsPlan({ date: TODAY }),
    select: (response) => response.data.data,
  });

  const { mutate: resetMealPlan, isPending: isResetting } = useMutation({
    mutationFn: userApi.resetMealPlan,
    onSuccess: (res) => {
      queryClient.setQueryData([userQueryKeys.getMealsPlan, TODAY], res);
      queryClient.invalidateQueries({
        queryKey: [userQueryKeys.getDashboardData],
      });
      toast.add({
        title: "План харчування на сьогодні скинуто",
        type: "success",
      });
    },
    onError: handleApiError,
  });

  const { mutate: removeMealPlanItem, isPending: isRemoving } = useMutation({
    mutationFn: userApi.removeMealPlanItem,
    onSuccess: (res) => {
      queryClient.setQueryData([userQueryKeys.getMealsPlan, TODAY], res);
      queryClient.invalidateQueries({
        queryKey: [userQueryKeys.getDashboardData],
      });
      toast.add({
        title: "Страва успішно видалена з плану",
        type: "success",
      });
    },
    onError: handleApiError,
  });

  const handleRemoveMeal = () => {
    if (!mealPlan || !idToRemove) {
      return;
    }

    removeMealPlanItem({
      planId: mealPlan.id,
      mealId: idToRemove,
    });
    setIdToRemove("");
  };

  if (isPending) {
    return (
      <section className={sectionStyles} aria-labelledby={planAriaLabel}>
        <h2 id={planAriaLabel} className={titleStyles}>
          Мій план на сьогодні
        </h2>
        <div className={cardWrapperStyles}>
          {mealSlots.map((slot) => (
            <Skeleton key={slot} className="w-65 max-w-xs self-stretch" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <section aria-labelledby={planAriaLabel} className={sectionStyles}>
        {isRemoving || isResetting ? (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-3">
            <Loader type="local" />
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-4">
          <h2 id={planAriaLabel} className={titleStyles}>
            Мій план на сьогодні
          </h2>
          <Button
            variant="outline"
            size="sm"
            disabled={isResetting || !mealPlan?.meals?.length}
            onClick={() => setIsResetConfirmationOpen(true)}
          >
            Очистити план
          </Button>
        </div>

        <div className={cardWrapperStyles}>
          {mealSlots.map((slot) => {
            const meal = mealPlan?.meals.find((item) => item.type === slot);

            if (!meal) {
              return (
                <div
                  key={slot}
                  className="rounded-lg border border-dashed border-border p-4 min-w-65 self-stretch"
                >
                  <p className="text-sm font-medium capitalize text-content">
                    {slot}
                  </p>
                  <p className="mt-1 text-sm text-content-muted">
                    Страву не обрано
                  </p>
                </div>
              );
            }

            return (
              <div key={slot} className="relative self-stretch">
                <MealCard
                  meal={meal}
                  onRemove={setIdToRemove}
                  className="h-full"
                />
              </div>
            );
          })}
        </div>
      </section>

      <ConfirmationPopup
        open={!!idToRemove}
        onOpenChange={(open) => !open && setIdToRemove("")}
        title="Видалити страву з плану?"
        onConfirm={handleRemoveMeal}
        isLoading={isRemoving}
      />

      <ConfirmationPopup
        open={isResetConfirmationOpen}
        onOpenChange={setIsResetConfirmationOpen}
        title="Скинути план харчування на сьогодні?"
        description="Усі страви буде видалено з плану."
        onConfirm={() => {
          if (mealPlan) {
            resetMealPlan({ planId: mealPlan.id });
            setIsResetConfirmationOpen(false);
          }
        }}
        isLoading={isResetting}
      />
    </>
  );
};
