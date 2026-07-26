import { userApi, UserQueryKeys } from "@/api/user/user-api";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: UserQueryKeys.getUser,
    queryFn: userApi.getUser,
    select: ({ data }) => data,
    retry: false,
  });
};
