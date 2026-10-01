import { ProgressBar } from "@/components/custom/user/ProgressBar";
import { AlertTriangle, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TODAY } from "@/lib/consts";
import { userApi, userQueryKeys } from "@/api/user/user-api";
import { Skeleton } from "@/components/ui/skeleton";

const sectionStyles =
  "rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6 min-h-50";
const sectionAriaLabel = "daily-norms-title";

export const DailyNorms = () => {
  const { data: dashboard, isPending: isDashboardPending } = useQuery({
    queryKey: [userQueryKeys.getDashboardData, TODAY],
    queryFn: () => userApi.getDashboardData({ date: TODAY }),
    select: (res) => res?.data?.data,
  });
  const isReady = dashboard?.status === "ready";
  const progress = dashboard?.progress;
  const missingProfileFields = dashboard?.missingProfileFields;

  if (isDashboardPending)
    return (
      <section aria-labelledby={sectionAriaLabel} className={sectionStyles}>
        <Skeleton className="h-6 w-full max-w-50 mb-10" />
        <Skeleton className="h-6 w-full mb-5" />
        <Skeleton className="h-6 w-full" />
      </section>
    );

  if (!isReady && missingProfileFields?.length)
    return (
      <section aria-labelledby={sectionAriaLabel} className={sectionStyles}>
        <div className="mb-4">
          <AlertTriangle
            className="size-12 fill-main text-white"
            aria-hidden="true"
          />
          <h2
            id={sectionAriaLabel}
            className="font-heading text-lg font-semibold"
          >
            Для того щоби бачити денні норми, будь ласка, заповніть такі дані
            профілю
          </h2>
          <p className="text-main">{missingProfileFields.join(", ")}</p>
        </div>
      </section>
    );

  return (
    <section aria-labelledby={sectionAriaLabel} className={sectionStyles}>
      <div className="mb-4 flex items-center gap-2">
        <Flame className="size-5 fill-main text-main" aria-hidden="true" />
        <h2
          id={sectionAriaLabel}
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
