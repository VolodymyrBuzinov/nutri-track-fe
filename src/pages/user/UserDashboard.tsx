import { userApi, userQueryKeys } from "@/api/user/user-api";
import { Loader } from "@/components/custom/shared/Loader";
import { DailyNorms } from "@/components/custom/user/DailyNorms";
import { MealPlan } from "@/components/custom/user/MealPlan";
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
        </div>
      )}
    </UserLayout>
  );
};
