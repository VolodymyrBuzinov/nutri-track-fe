import { userApi, userQueryKeys } from "@/api/user/user-api";
import { Loader } from "@/components/custom/shared/Loader";
import { DailyNorms } from "@/components/custom/user/DailyNorms";
import { UserLayout } from "@/layouts/UserLayout";
import { DATE_FORMAT } from "@/lib/consts";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const UserDashboard = () => {
  const { data, isPending } = useQuery({
    queryKey: [userQueryKeys.getDashboardData],
    queryFn: () =>
      userApi.getDashboardData({
        date: format(new Date(), DATE_FORMAT),
      }),
  });

  return (
    <UserLayout>
      {isPending ? (
        <Loader type="global" />
      ) : (
        <>
          <DailyNorms progress={data?.data.data.progress} />
        </>
      )}
    </UserLayout>
  );
};
