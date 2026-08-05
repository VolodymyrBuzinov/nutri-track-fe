import { userApi, userQueryKeys } from "@/api/user/user-api";
import { Loader } from "@/components/custom/shared/Loader";
import { MealsSection } from "@/components/custom/meals/MealsSection";
import { DailyNorms } from "@/components/custom/user/DailyNorms";
import { MealPlan } from "@/components/custom/user/MealPlan";
import { Recommendations } from "@/components/custom/user/Recommendations";
import { WaterBalance } from "@/components/custom/user/WaterBalance";
import { UserLayout } from "@/layouts/UserLayout";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { DATE_FORMAT } from "@/lib/consts";

export const UserDashboard = () => {
  const date = format(new Date(), DATE_FORMAT);
  const { data: dashboard, isPending: isDashboardPending } = useQuery({
    queryKey: [userQueryKeys.getDashboardData],
    queryFn: () => userApi.getDashboardData({ date }),
    select: (res) => res?.data?.data,
  });
  if (!dashboard && !isDashboardPending) return <UserLayout>{null}</UserLayout>;

  return (
    <UserLayout>
      {isDashboardPending ? (
        <Loader type="global" />
      ) : (
        <div className="space-y-6">
          <DailyNorms progress={dashboard?.progress} />
          <MealPlan />
          <section
            aria-labelledby="recommendations-title"
            className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6"
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <Recommendations />
              <WaterBalance />
            </div>
          </section>
          <MealsSection />
        </div>
      )}
    </UserLayout>
  );
};
