import { ConfirmationPopup } from "@/components/custom/shared/ConfirmationPopup";
import { MealCard } from "@/components/custom/meals/MealCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { userApi, userQueryKeys } from "@/api/user/user-api";
import { toast } from "@/components/ui/toast";
import { DATE_FORMAT } from "@/lib/consts";
import { handleApiError } from "@/lib/utils";
import { queryClient } from "@/queryClient";
import type { Meal } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

const mealSlots: Meal["type"][] = ["сніданок", "обід", "вечеря"];

export const MealPlan = () => {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [idToRemove, setIdToRemove] = useState("");
  const [isResetConfirmationOpen, setIsResetConfirmationOpen] = useState(false);
  const date = format(new Date(), DATE_FORMAT);

  const { data: mealPlan } = useQuery({
    queryKey: [userQueryKeys.getMealsPlan, date],
    queryFn: () => userApi.getMealsPlan({ date }),
    select: (response) => response.data.data,
  });

  const { mutate: resetMealPlan, isPending: isResetting } = useMutation({
    mutationFn: userApi.resetMealPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [userQueryKeys.getMealsPlan, date],
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [userQueryKeys.getMealsPlan, date],
      });
      toast.add({
        title: "План харчування на сьогодні оновлено",
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

  return (
    <>
      <section
        aria-labelledby="meal-plan-title"
        className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            id="meal-plan-title"
            className="font-heading text-lg font-semibold"
          >
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

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {mealSlots.map((slot) => {
            const meal = mealPlan?.meals.find((item) => item.type === slot);

            if (!meal) {
              return (
                <div
                  key={slot}
                  className="rounded-lg border border-dashed border-border p-4"
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
              <DropdownMenu key={slot}>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="group relative w-full text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/30"
                    />
                  }
                >
                  <MealCard meal={meal} />
                  <MoreHorizontal
                    className="absolute top-2 right-2 size-5 rounded bg-white/90 p-0.5 text-content"
                    aria-hidden="true"
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedMeal(meal)}>
                    <Eye />
                    Переглянути деталі
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setIdToRemove(meal.id)}
                  >
                    <Trash2 />
                    Видалити
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </div>
      </section>

      <Dialog
        open={selectedMeal !== null}
        onOpenChange={(open) => !open && setSelectedMeal(null)}
      >
        {selectedMeal && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedMeal.name}</DialogTitle>
              <DialogDescription>{selectedMeal.description}</DialogDescription>
            </DialogHeader>
            <img
              src={selectedMeal.imageUrl}
              alt={selectedMeal.name}
              className="h-48 w-full rounded-lg object-cover"
            />
            <div className="grid grid-cols-2 gap-3 text-sm text-content-muted">
              <span>Калорії: {selectedMeal.composition.calories} ккал</span>
              <span>Білки: {selectedMeal.composition.protein} г</span>
              <span>Жири: {selectedMeal.composition.fat} г</span>
              <span>Вуглеводи: {selectedMeal.composition.carbohydrates} г</span>
            </div>
          </DialogContent>
        )}
      </Dialog>

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
