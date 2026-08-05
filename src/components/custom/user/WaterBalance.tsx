import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { DATE_FORMAT } from "@/lib/consts";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Droplets, RotateCcw } from "lucide-react";
import { useState } from "react";

const GLASS_VOLUME_ML = 250;
const DEFAULT_WATER_TARGET_ML = 2_000;

export const WaterBalance = () => {
  const { currentUser } = useAuth();
  const weight =
    currentUser.type === "user" ? currentUser.account?.weight : undefined;
  const waterTargetMl =
    weight && weight > 0
      ? Math.round((weight * 30) / 50) * 50
      : DEFAULT_WATER_TARGET_ML;
  const totalGlasses = Math.max(1, Math.ceil(waterTargetMl / GLASS_VOLUME_ML));
  const storageKey = `${format(new Date(), DATE_FORMAT)}-water-balance`;
  const [glassesDrunk, setGlassesDrunk] = useState(() => {
    Object.keys(localStorage).forEach((key) => {
      if (key.endsWith("-water-balance") && key !== storageKey) {
        localStorage.removeItem(key);
      }
    });

    const savedValue = Number(localStorage.getItem(storageKey));

    return Number.isInteger(savedValue) && savedValue >= 0
      ? Math.min(savedValue, totalGlasses)
      : 0;
  });

  const updateGlassesDrunk = (value: number) => {
    const nextValue = Math.min(Math.max(value, 0), totalGlasses);
    setGlassesDrunk(nextValue);
    localStorage.setItem(storageKey, String(nextValue));
  };

  const consumedMl = Math.min(glassesDrunk * GLASS_VOLUME_ML, waterTargetMl);

  return (
    <div className="border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
      <div className="flex items-center gap-2">
        <Droplets
          className="size-5 fill-sky-500 text-sky-500"
          aria-hidden="true"
        />
        <h2 className="font-heading text-lg font-semibold">Вода</h2>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-content">
        {consumedMl / 1_000} л
        <span className="ml-2 text-base font-normal text-content-muted">
          / {waterTargetMl / 1_000} л
        </span>
      </p>
      <p className="mt-1 text-sm text-content-muted">
        Норма: 30 мл на 1 кг ваги
      </p>

      <div
        className="mt-4 flex flex-wrap gap-2"
        aria-label={`Випито ${glassesDrunk} з ${totalGlasses} склянок`}
      >
        {Array.from({ length: totalGlasses }, (_, index) => (
          <Droplets
            key={index}
            className={cn(
              "size-7",
              index < glassesDrunk
                ? "fill-sky-500 text-sky-500"
                : "text-border"
            )}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="mt-5 flex gap-2">
        <Button
          className="flex-1"
          disabled={glassesDrunk === totalGlasses}
          onClick={() => updateGlassesDrunk(glassesDrunk + 1)}
        >
          Додати склянку
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={glassesDrunk === 0}
          aria-label="Скинути випиту воду"
          onClick={() => updateGlassesDrunk(0)}
        >
          <RotateCcw aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
