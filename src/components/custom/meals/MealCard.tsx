import type { Meal } from "@/types";

interface MealCardProps {
  meal: Meal;
}

export const MealCard = ({ meal }: MealCardProps) => {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-white">
      <img
        src={meal.imageUrl}
        alt={meal.name}
        className="h-32 w-full object-cover"
      />
      <div className="p-3">
        <p className="text-xs capitalize text-main">{meal.type}</p>
        <h3 className="mt-1 truncate text-sm font-medium text-content">
          {meal.name}
        </h3>
        <p className="mt-1 text-xs text-content-muted">
          {meal.composition.calories} ккал
        </p>
      </div>
    </article>
  );
};
