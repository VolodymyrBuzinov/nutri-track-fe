import { mealsApi, mealsQueryKeys } from "@/api/meals/meals-api";
import { userApi, userQueryKeys } from "@/api/user/user-api";
import { MealCard } from "@/components/custom/meals/MealCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "@/components/ui/toast";
import { DATE_FORMAT } from "@/lib/consts";
import { handleApiError } from "@/lib/utils";
import { queryClient } from "@/queryClient";
import type { MealPlan } from "@/types";

import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns/format";
import { Loader } from "../shared/Loader";

const mealTypes: { type: string; label: string }[] = [
  { type: "сніданок", label: "Сніданки" },
  { type: "обід", label: "Обіди" },
  { type: "вечеря", label: "Вечері" },
];

const onSuccess = () => {
  queryClient.invalidateQueries({
    queryKey: [userQueryKeys.getMealsPlan],
  });
  queryClient.invalidateQueries({
    queryKey: [userQueryKeys.getDashboardData],
  });
  toast.add({
    title: "Страва додана до плану харчування",
    type: "success",
  });
};

const today = format(new Date(), DATE_FORMAT);

export const MealsSection = () => {
  const { data: meals = [] } = useQuery({
    queryKey: [mealsQueryKeys.getMeals],
    queryFn: () => mealsApi.getMeals({}),
    select: (response) => response.data.data,
  });

  const { mutate: createMealPlan, isPending: isCreatingMealPlan } = useMutation(
    {
      mutationFn: userApi.createMealPlan,
      onError: handleApiError,
      onSuccess,
    }
  );

  const { mutate: updateMealPlan, isPending: isUpdatingMealPlan } = useMutation(
    {
      mutationFn: userApi.updateMealPlan,
      onSuccess,
      onError: handleApiError,
    }
  );

  const handleAddMeal = (mealId: string) => {
    const mealPlan = queryClient.getQueryData<{ data: { data: MealPlan } }>([
      userQueryKeys.getMealsPlan,
      today,
    ])?.data?.data;

    if (mealPlan) {
      return updateMealPlan({
        planId: mealPlan.id,
        date: mealPlan.date,
        meals: [mealId],
      });
    }

    createMealPlan({ date: today, meals: [mealId] });
  };

  return (
    <section
      aria-labelledby="meals-title"
      className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6"
    >
      <h2 id="meals-title" className="font-heading text-lg font-semibold">
        Усі страви
      </h2>

      <div className="mt-5 space-y-6 relative">
        {isCreatingMealPlan || isUpdatingMealPlan ? (
          <Loader
            type="local"
            className="absolute top-0 left-0 w-full h-full"
          />
        ) : null}
        {mealTypes.map(({ type, label }) => {
          const mealsByType = meals.filter((meal) => meal.type === type);

          return (
            <div key={type}>
              <h3 className="text-sm font-medium capitalize text-content font-bold">
                {label}
              </h3>

              {mealsByType.length ? (
                <Carousel
                  opts={{ align: "start", containScroll: "trimSnaps" }}
                  className="mt-3"
                >
                  <CarouselContent>
                    {mealsByType.map((meal) => (
                      <CarouselItem
                        key={meal.id}
                        className="flex justify-center basis-80 relative"
                      >
                        <MealCard meal={meal} onAdd={handleAddMeal} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:inline-flex md:-left-12" />
                  <CarouselNext className="hidden md:inline-flex md:-right-12" />
                </Carousel>
              ) : (
                <p className="mt-2 text-sm text-content-muted">
                  Страви не знайдено.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
