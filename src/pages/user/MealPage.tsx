import { mealsApi, mealsQueryKeys } from "@/api/meals/meals-api";
import { useAddMealToPlan } from "@/components/custom/meals/useAddMealToPlan";
import { Loader } from "@/components/custom/shared/Loader";
import { PFC } from "@/components/custom/shared/PFC";
import { Button } from "@/components/ui/button";
import { UserLayout } from "@/layouts/UserLayout";
import { routes } from "@/routing/routes";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Flame, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export const MealPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { handleAddMeal, isPending: isAdding } = useAddMealToPlan();

  const {
    data: meal,
    isPending,
    isError,
  } = useQuery({
    queryKey: [mealsQueryKeys.getMeal, slug],
    queryFn: () => mealsApi.getMeal(slug!),
    select: (response) => response.data.data,
    enabled: Boolean(slug),
  });

  if (isPending) {
    return (
      <UserLayout>
        <Loader type="global" />
      </UserLayout>
    );
  }

  if (isError || !meal) {
    return (
      <UserLayout>
        <div className="space-y-4">
          <Link
            to={routes.user_dashboard}
            className="inline-flex items-center gap-2 text-sm text-content-muted transition-colors hover:text-main"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Назад до страв
          </Link>
          <p className="text-content-muted">Страву не знайдено.</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        <Link
          to={routes.user_dashboard}
          className="inline-flex items-center gap-2 text-sm text-content-muted transition-colors hover:text-main"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Назад до страв
        </Link>

        <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={meal.imageUrl}
                alt={meal.name}
                className="aspect-[4/3] w-full object-cover"
              />
              <span className="absolute left-3 top-3 rounded-md bg-main px-2.5 py-1 text-xs font-medium capitalize text-white">
                {meal.type}
              </span>
            </div>

            <div className="flex flex-col">
              <h1 className="font-heading text-2xl font-semibold text-content sm:text-3xl">
                {meal.name}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-content-muted">
                {meal.description}
              </p>

              <div className="mt-6">
                <h2 className="text-sm font-semibold text-content">
                  Харчова цінність
                </h2>
                <div className="mt-3 flex items-center gap-2">
                  <Flame
                    className="size-5 fill-main text-main"
                    aria-hidden="true"
                  />
                  <p className="text-2xl font-semibold text-content">
                    {meal.composition.calories}{" "}
                    <span className="text-base font-normal text-content-muted">
                      ккал
                    </span>
                  </p>
                </div>

                <PFC
                  className="mt-4"
                  variant="detailed"
                  protein={meal.composition.protein}
                  fat={meal.composition.fat}
                  carbohydrates={meal.composition.carbohydrates}
                />
              </div>

              <div className="mt-6">
                <Button
                  className="w-full"
                  disabled={isAdding}
                  onClick={() => handleAddMeal(meal.id)}
                >
                  <Plus aria-hidden="true" />
                  Додати до плану
                </Button>
                <p className="mt-2 text-center text-xs text-content-muted">
                  Страва буде додана до плану на сьогодні.
                </p>
              </div>
            </div>
          </div>
        </section>

        {meal.composition.products.length ? (
          <section
            aria-labelledby="ingredients-title"
            className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6"
          >
            <h2
              id="ingredients-title"
              className="font-heading text-lg font-semibold text-content"
            >
              Інгредієнти
            </h2>

            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left text-content-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Продукт</th>
                    <th className="px-4 py-3 font-medium">Кількість</th>
                  </tr>
                </thead>
                <tbody>
                  {meal.composition.products.map((product) => (
                    <tr
                      key={`${product.name}-${product.count}`}
                      className="border-t border-border"
                    >
                      <td className="px-4 py-3 text-content">{product.name}</td>
                      <td className="px-4 py-3 text-content-muted">
                        {product.count} {product.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </div>
    </UserLayout>
  );
};
