import { mealsApi, mealsQueryKeys } from "@/api/meals/meals-api";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { Loader } from "../shared/Loader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MealCard } from "./MealCard";
import { useAddMealToPlan } from "./useAddMealToPlan";

export const MealsSearch = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { data: products } = useQuery({
    queryFn: mealsApi.getProducts,
    queryKey: [mealsQueryKeys.getProducts],
    select: (res) => res?.data?.data,
  });
  const { data: meals, isPending: isMealsLoading } = useQuery({
    queryFn: () => mealsApi.getMealsByProducts(selectedProducts),
    queryKey: [mealsQueryKeys.searchByProducts, selectedProducts],
    select: (res) => res?.data?.data,
    enabled: selectedProducts?.length > 0,
  });
  const { handleAddMeal } = useAddMealToPlan();
  const anchor = useComboboxAnchor();
  return (
    <section
      aria-labelledby="recommendations-title"
      className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6"
    >
      <Combobox
        multiple
        autoHighlight
        items={products}
        onValueChange={setSelectedProducts}
      >
        <ComboboxChips ref={anchor} className="w-full max-w-xs">
          <ComboboxValue>
            {(values) => (
              <Fragment>
                {values.map((value: string) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput
                  placeholder={
                    !values.length ? "Виберіть продукти для пошуку страв" : ""
                  }
                />
              </Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {meals ? (
        <div className="mt-4">
          <h3 className="text-sm font-bold text-content">
            Страви з вибранними продуктами
          </h3>

          {isMealsLoading ? <Loader type="local" /> : null}

          {meals.length && !isMealsLoading ? (
            <Carousel
              opts={{ align: "start", containScroll: "trimSnaps" }}
              className="mt-3"
            >
              <CarouselContent>
                {meals?.map((meal) => (
                  <CarouselItem
                    key={meal.id}
                    className="relative flex basis-70 justify-center"
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
      ) : null}
    </section>
  );
};
