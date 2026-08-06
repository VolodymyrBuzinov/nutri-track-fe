import { userAuthApi } from "@/api/user/user-api";
import { UserAvatar } from "@/components/custom/user/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/authContext";
import { cn } from "@/lib/utils";
import { queryClient } from "@/queryClient";
import { routes } from "@/routing/routes";
import type { User } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { ChevronDown, Home, LogOut, UserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface UserLayoutProps {
  children: React.ReactNode;
}

const userPages = [
  { name: "Головна", path: routes.user_dashboard, icon: Home },
  { name: "Профіль", path: routes.user_profile, icon: UserRound },
];

export const UserLayout = ({ children }: UserLayoutProps) => {
  const location = useLocation();
  const { currentUser, setCurrentUser } = useAuth();
  const user = currentUser?.account as User;
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: userAuthApi.logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ refetchType: "none" });
      setCurrentUser(null);
      localStorage.clear();
    },
  });

  return (
    <div className="flex min-h-svh flex-1 flex-col bg-surface">
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center  gap-3 px-4 sm:h-18 sm:px-6 lg:px-8">
          <Link
            to={routes.user_dashboard}
            aria-label="Nutri Track"
            className="shrink-0"
          >
            <img
              src="/src/assets/logo.svg"
              alt="Nutri Track"
              width={245}
              height={56}
              className="h-10 w-auto block md:h-14"
            />
          </Link>

          <nav aria-label="Основна навігація" className="flex h-full gap-2">
            {userPages.map((page) => {
              const isActive = location.pathname === page.path;

              return (
                <Link
                  key={page.path}
                  to={page.path}
                  className={cn(
                    "relative flex h-full items-center gap-2 px-2 text-xs font-medium text-content-muted transition-colors hover:text-main sm:px-4 sm:text-sm",
                    isActive &&
                      "text-main after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-main sm:after:inset-x-4"
                  )}
                >
                  <page.icon className="size-4" aria-hidden="true" />
                  <span className="hidden md:inline">{page.name}</span>
                </Link>
              );
            })}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label="Меню профілю"
                  className="flex items-center gap-2 rounded-lg p-1 ml-auto cursor-pointer"
                />
              }
            >
              <span className="block font-medium text-content hidden md:block">
                {user?.name ?? "Користувач"}
              </span>
              <UserAvatar
                avatarUrl={user?.avatarUrl}
                name={user?.name ?? "Користувач"}
                className="size-9 min-w-9"
                size={36}
              />
              <ChevronDown className="hidden size-4 text-content-muted sm:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem render={<Link to={routes.user_profile} />}>
                <UserRound />
                Профіль
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                disabled={isLoggingOut}
                onClick={() => logout()}
              >
                <LogOut />
                Вийти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-center text-xs text-content-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left lg:px-8">
          <p>© {new Date().getFullYear()} Nutri Track. Усі права захищені.</p>
          <p>Плануйте харчування свідомо.</p>
        </div>
      </footer>
    </div>
  );
};
