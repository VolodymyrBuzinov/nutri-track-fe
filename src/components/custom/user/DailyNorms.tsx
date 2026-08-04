import type { DashboardProgress } from "@/types";
import { ProgressBar } from "@/components/custom/user/ProgressBar";
import { Flame } from "lucide-react";

interface DailyNormsProps {
  progress: DashboardProgress | undefined;
}

export const DailyNorms = ({ progress }: DailyNormsProps) => {
  return (
    <section
      aria-labelledby="daily-norms-title"
      className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <Flame className="size-5 fill-main text-main" aria-hidden="true" />
        <h2
          id="daily-norms-title"
          className="font-heading text-lg font-semibold"
        >
          Денна норма калорій
        </h2>
      </div>

      <div className="space-y-5">
        <ProgressBar progress={progress?.calories} aria-label="Спожиті калорії">
          {({ consumed, total, percentage }) => (
            <div className="flex items-end justify-between gap-4">
              <p className="text-2xl font-semibold tracking-tight text-content sm:text-3xl">
                {consumed}
                <span className="ml-2 text-base font-normal text-content-muted sm:text-lg">
                  / {total} ккал
                </span>
              </p>
              <span className="text-sm font-medium text-content-muted">
                {percentage}%
              </span>
            </div>
          )}
        </ProgressBar>

        <div className="grid gap-4 md:grid-cols-3">
          <ProgressBar progress={progress?.protein} progressBarColor="blue">
            {({ consumed, total }) => (
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-content">Білки</span>
                <span className="text-content-muted">
                  {consumed} / {total} г
                </span>
              </div>
            )}
          </ProgressBar>
          <ProgressBar progress={progress?.fat} progressBarColor="orange">
            {({ consumed, total }) => (
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-content">Жири</span>
                <span className="text-content-muted">
                  {consumed} / {total} г
                </span>
              </div>
            )}
          </ProgressBar>
          <ProgressBar
            progress={progress?.carbohydrates}
            progressBarColor="green"
          >
            {({ consumed, total }) => (
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-content">Вуглеводи</span>
                <span className="text-content-muted">
                  {consumed} / {total} г
                </span>
              </div>
            )}
          </ProgressBar>
        </div>
      </div>
    </section>
  );
};
