import { adminApi, adminQueryKeys } from "@/api/admin/admin-api";
import { userApi, userQueryKeys } from "@/api/user/user-api";
import { queryClient } from "@/queryClient";
import type { Admin, User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

const isAdminRoute = location.pathname.split("/")[1] === "admin";

const initialUserData: CurrentAccount = {
  type: isAdminRoute ? "admin" : "user",
  account: null,
};

const AuthContext = createContext<AuthContextType>({
  currentUser: initialUserData,
  isPending: false,
  setCurrentUser: () => {},
});

interface AuthContextType {
  currentUser: CurrentAccount;
  isPending: boolean;
  setCurrentUser: (user: CurrentAccount | null) => void;
}

type CurrentAccount =
  | { type: "admin"; account: Admin | null }
  | { type: "user"; account: User | null };

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: userData, isPending } = useQuery<CurrentAccount>({
    queryKey: [
      isAdminRoute ? adminQueryKeys.current_admin : userQueryKeys.getUser,
    ],
    queryFn: async () => {
      if (isAdminRoute) {
        const response = await adminApi.getAdmin();
        return {
          type: "admin",
          account: response.data.data,
        };
      }
      const response = await userApi.getUser();
      return {
        type: "user",
        account: response.data,
      };
    },
    retry: false,
  });

  const setCurrentUser = (user: CurrentAccount | null) => {
    queryClient.setQueryData(
      [isAdminRoute ? adminQueryKeys.current_admin : userQueryKeys.getUser],
      {
        type: isAdminRoute ? "admin" : "user",
        account: user,
      }
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: userData ?? initialUserData,
        isPending,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
