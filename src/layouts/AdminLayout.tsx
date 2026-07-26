import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { routes } from "@/routing/routes";
import { User, Utensils } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminPages = [
  { name: "Users", path: routes.admin_users, icon: User },
  { name: "Meals", path: routes.admin_meals, icon: Utensils },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();

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
      <div className="min-w-0 flex-1">
        <header></header>
        <div>{children}</div>
      </div>
    </main>
  );
};
