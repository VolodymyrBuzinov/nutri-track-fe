import { Button, buttonVariants } from "@/components/ui/button";
import { PFC } from "@/components/custom/shared/PFC";
import { cn } from "@/lib/utils";
import { routes } from "@/routing/routes";
import type { Meal } from "@/types";
import { Link } from "react-router-dom";

interface MealCardProps {
  meal: Meal;
  onAdd?: (mealId: string) => void;
}

export const MealCard = ({ meal, onAdd }: MealCardProps) => {
  return (
    <article className="flex w-full max-w-xs flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="relative">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="h-40 w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-md bg-main-soft px-2.5 py-1 text-xs font-medium capitalize text-main">
          {meal.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-sm font-semibold leading-snug text-content">
            {meal.name}
          </h3>
          <p className="shrink-0 text-sm text-content">
            {meal.composition.calories} ккал
          </p>
        </div>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-content-muted">
          {meal.description}
        </p>

        <PFC
          className="mt-4"
          protein={meal.composition.protein}
          fat={meal.composition.fat}
          carbohydrates={meal.composition.carbohydrates}
        />

        <div className="mt-auto pt-4">
          <div className="flex flex-col items-center gap-2 border-t border-border pt-3">
            {onAdd ? (
              <Button
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(meal.id);
                }}
              >
                Додати до плану
              </Button>
            ) : null}
            <Link
              to={routes.user_meal(meal.slug)}
              className={cn(buttonVariants({ variant: "link", size: "sm" }))}
            >
              Детальніше
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
