import { adminApi, adminQueryKeys } from "@/api/admin/admin-api";
import { useQuery } from "@tanstack/react-query";

export const useCurrentAdmin = (enabled = false) => {
  return useQuery({
    queryKey: [adminQueryKeys.current_admin],
    queryFn: adminApi.getAdmin,
    select: ({ data: { data } }) => data,
    retry: false,
    enabled,
  });
};
