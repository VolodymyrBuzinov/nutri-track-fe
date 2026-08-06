import { mealsApi, mealsQueryKeys } from "@/api/meals/meals-api";
import { MealCard } from "@/components/custom/meals/MealCard";
import { useAddMealToPlan } from "@/components/custom/meals/useAddMealToPlan";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../shared/Loader";

const mealTypes: { type: string; label: string }[] = [
  { type: "сніданок", label: "Сніданки" },
  { type: "обід", label: "Обіди" },
  { type: "вечеря", label: "Вечері" },
];

export const MealsSection = () => {
  const { data: meals = [] } = useQuery({
    queryKey: [mealsQueryKeys.getMeals],
    queryFn: () => mealsApi.getMeals({}),
    select: (response) => response.data.data,
  });

  const { handleAddMeal, isPending } = useAddMealToPlan();

  return (
    <section
      aria-labelledby="meals-title"
      className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6"
    >
      <h2 id="meals-title" className="font-heading text-lg font-semibold">
        Усі страви
      </h2>

      <div className="relative mt-5 space-y-6">
        {isPending ? (
          <Loader
            type="local"
            className="absolute top-0 left-0 h-full w-full"
          />
        ) : null}
        {mealTypes.map(({ type, label }) => {
          const mealsByType = meals.filter((meal) => meal.type === type);

          return (
            <div key={type}>
              <h3 className="text-sm font-bold capitalize text-content">
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
                        className="relative flex basis-80 justify-center"
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
