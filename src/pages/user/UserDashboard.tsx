import { userApi, userQueryKeys } from "@/api/user/user-api";
import { UserLayout } from "@/layouts/UserLayout";
import { DATE_FORMAT } from "@/lib/consts";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const UserDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: [userQueryKeys.getDashboardData],
    queryFn: () =>
      userApi.getDashboardData({
        date: format(new Date(), DATE_FORMAT),
      }),
  });

  console.log(data, "data");
  console.log(isLoading, "isLoading");

  return <UserLayout>Dashboard</UserLayout>;
};
