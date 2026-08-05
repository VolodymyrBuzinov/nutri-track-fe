import { Activity, Droplets, Leaf, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  iconClassName?: string;
}

const defaultRecommendations: Recommendation[] = [
  {
    id: "vegetables",
    title: "Додавайте овочі до прийомів їжі",
    description: "Овочі додають клітковину та допомагають довше зберігати ситість.",
    icon: Leaf,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "water",
    title: "Пийте воду протягом дня",
    description: "Тримайте воду поруч і робіть кілька ковтків щогодини.",
    icon: Droplets,
    iconClassName: "bg-sky-50 text-sky-600",
  },
  {
    id: "activity",
    title: "Залишайтеся активними",
    description: "Навіть коротка прогулянка допомагає підтримувати гарне самопочуття.",
    icon: Activity,
    iconClassName: "bg-amber-50 text-amber-600",
  },
];

interface RecommendationsProps {
  items?: Recommendation[];
}

export const Recommendations = ({
  items = defaultRecommendations,
}: RecommendationsProps) => (
  <div>
    <h2 id="recommendations-title" className="font-heading text-lg font-semibold">
      Поради
    </h2>

    <ul
      aria-labelledby="recommendations-title"
      className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {items.map(
        ({
          id,
          title,
          description,
          icon: Icon,
          iconClassName = "bg-main-soft text-main",
        }) => (
          <li key={id} className="flex min-w-0 gap-3">
            {Icon ? (
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg",
                  iconClassName
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </div>
            ) : null}
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-content">{title}</h3>
              <p className="mt-1 text-sm text-content-muted">
                {description}
              </p>
            </div>
          </li>
        )
      )}
    </ul>
  </div>
);
