import { Button } from "@/components/ui/button";
import type { Meal } from "@/types";

interface MealCardProps {
  meal: Meal;
  onAdd?: (mealId: string) => void;
  onClick?: () => void;
}

export const MealCard = ({ meal, onAdd, onClick }: MealCardProps) => {
  return (
    <article
      className="w-full max-w-xs overflow-hidden rounded-lg border border-border bg-white"
      onClick={onClick}
    >
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
      {onAdd ? (
        <Button
          className="text-xs z-5 m-2"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onAdd?.(meal.id);
          }}
        >
          Додати до плану
        </Button>
      ) : null}
    </article>
  );
};
