import { adminAuthApi } from "@/api/admin/admin-api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { queryClient } from "@/queryClient";
import { routes } from "@/routing/routes";
import { useMutation } from "@tanstack/react-query";
import { ChevronDown, LogOut, User, Utensils } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const admin = {
  name: "Admin",
  icon: User,
};

const adminPages = [
  { name: "Users", path: routes.admin_users, icon: User },
  { name: "Meals", path: routes.admin_meals, icon: Utensils },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: adminAuthApi.logout,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  return (
    <main className="flex flex-1 gap-6">
      <nav className="min-h-screen w-20 shrink-0 bg-white p-4">
        <img
          width={48}
          height={48}
          src="/favicon.svg"
          alt="Nutri Track logo"
          className="mb-6"
        />
        {adminPages.map((page) => (
          <Popover key={page.path}>
            <PopoverTrigger
              openOnHover
              delay={0}
              nativeButton={false}
              render={
                <Link
                  to={page.path}
                  aria-label={page.name}
                  className={cn(
                    "mb-2 flex size-12 items-center justify-center rounded-md transition-colors hover:bg-main-hover hover:text-white",
                    location.pathname === page.path &&
                      "bg-main-hover text-white"
                  )}
                />
              }
            >
              <page.icon />
            </PopoverTrigger>
            <PopoverContent side="right" className="w-auto px-3 py-2">
              {page.name}
            </PopoverContent>
          </Popover>
        ))}
      </nav>
      <div className="min-w-0 flex-1 pr-6 flex flex-col">
        <header className="flex justify-end border-b border-border py-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label={`${admin?.name ?? "Admin"} menu`}
                  className="flex items-center gap-2 rounded-md p-1 hover:bg-main-soft"
                />
              }
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-main-soft">
                <User className="size-7 text-main" />
              </span>
              <ChevronDown className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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
        </header>
        <div className="flex flex-col flex-1">{children}</div>
      </div>
    </main>
  );
};
