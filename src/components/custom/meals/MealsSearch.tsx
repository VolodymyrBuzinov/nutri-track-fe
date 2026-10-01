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
import { ShoppingCart, CircleOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const emptyWrapperStyles =
  "rounded-md flex-1 bg-gray-100 flex flex-col items-center justify-center";
const emptyIconStyles = "size-20 text-main";
const emptyTitleStyles = "mt-2 font-bold text-content-muted text-center";
const emptyTextStyles = "mt-2 text-sm text-content-muted text-center";

export const MealsSearch = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { data: products, isPending: isProductsPending } = useQuery({
    queryFn: mealsApi.getProducts,
    queryKey: [mealsQueryKeys.getProducts],
    select: (res) => res?.data?.data,
  });
  const { data: meals, isLoading: isMealsLoading } = useQuery({
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
        disabled={isProductsPending}
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

      <div className="mt-4 min-h-100 flex flex-col relative">
        <h3 className="text-sm font-bold text-content mb-4">
          Страви з вибранними продуктами
        </h3>

        {isMealsLoading ? (
          <div className="flex items-center justify-center absolute inset-0 z-3 bg-white/50">
            <Loader type="local" />
          </div>
        ) : null}

        {isProductsPending ? (
          <Skeleton className="flex-1 w-full rounded-md" />
        ) : null}

        {!selectedProducts.length && !isProductsPending ? (
          <div className={emptyWrapperStyles}>
            <ShoppingCart className={emptyIconStyles} />
            <h3 className={emptyTitleStyles}>
              Виберіть продукти щоб побачити страви
            </h3>
            <p className={emptyTextStyles}>
              Оберіть один або декілька у верньому полі і ми підберемо для вас
              смачні рецепти
            </p>
          </div>
        ) : null}

        {selectedProducts.length && !meals?.length && !isMealsLoading ? (
          <div className={emptyWrapperStyles}>
            <CircleOff className={emptyIconStyles} />
            <h3 className={emptyTitleStyles}>
              Нажаль за вашими фільтрами нічого не знайдено
            </h3>
            <p className={emptyTextStyles}>Спробуйте змінити склад продуктів</p>
          </div>
        ) : null}

        {meals?.length ? (
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
        ) : null}
      </div>
    </section>
  );
};
