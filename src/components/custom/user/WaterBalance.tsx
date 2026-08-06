import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { TODAY } from "@/lib/consts";
import { cn } from "@/lib/utils";
import { Droplets, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

const storageKey = `${TODAY}-water-balance`;
const GLASS_VOLUME_ML = 250;
const containerStyles =
  "border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6";

export const WaterBalance = () => {
  const { currentUser } = useAuth();
  const weight =
    currentUser.type === "user" ? currentUser.account?.weight : undefined;
  const waterTargetMl = weight && weight > 0 ? Math.round(weight * 30) : 0;
  const totalGlasses = Math.max(1, Math.ceil(waterTargetMl / GLASS_VOLUME_ML));
  const [glassesDrunk, setGlassesDrunk] = useState(0);

  useEffect(() => {
    Object.keys(localStorage).forEach((key) => {
      if (key.endsWith("-water-balance") && key !== storageKey) {
        localStorage.removeItem(key);
      }
    });

    const savedValue = Number(localStorage.getItem(storageKey));

    if (Number.isInteger(savedValue) && savedValue >= 0) {
      setGlassesDrunk(Math.min(savedValue, totalGlasses));
    }
  }, [weight]);

  const updateGlassesDrunk = (value: number) => {
    const nextValue = Math.min(Math.max(value, 0), totalGlasses);
    setGlassesDrunk(nextValue);
    localStorage.setItem(storageKey, String(nextValue));
  };

  const consumedMl = Math.min(glassesDrunk * GLASS_VOLUME_ML, waterTargetMl);

  if (!weight) return null;

  return (
    <div className={containerStyles}>
      <div className="flex items-center gap-2">
        <Droplets
          className="size-5 fill-sky-500 text-sky-500"
          aria-hidden="true"
        />
        <h2 className="font-heading text-lg font-semibold">Водний баланс</h2>
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
              index < glassesDrunk ? "fill-sky-500 text-sky-500" : "text-border"
            )}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="mt-5 flex gap-2">
        <Button
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
