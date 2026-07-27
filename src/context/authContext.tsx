// import { adminApi, adminQueryKeys } from "@/api/admin/admin-api";
// import { userApi, userQueryKeys } from "@/api/user/user-api";
// import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

export type AuthStatus = "unknown" | "authenticated" | "unauthenticated";

interface AuthContextType {
  authStatus: AuthStatus;
  setAuthStatus: (authStatus: AuthStatus) => void;
}

const AuthContext = createContext<AuthContextType>({
  authStatus: "unknown",
  setAuthStatus: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("unknown");
  const isAdminRoute = location.pathname.split("/")[1] === "admin";

  console.log(isAdminRoute, "isAdmin");

  // const { data: currentUser } = useQuery({
  //   queryKey: [
  //     isAdminRoute ? adminQueryKeys.current_admin : userQueryKeys.getUser,
  //   ],
  //   queryFn: () => (isAdminRoute ? adminApi.getAdmin() : userApi.getUser()),
  //   retry: false,
  //   enabled: authStatus === "authenticated",
  // });

  return (
    <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
