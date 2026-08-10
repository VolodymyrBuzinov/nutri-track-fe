import { ProfileBadge } from "@/components/custom/user/ProfileBadge";
import { ProfileForm } from "@/components/custom/user/ProfileForm";

import { UserLayout } from "@/layouts/UserLayout";

export const UserProfile = () => {
  return (
    <UserLayout>
      <div className="space-y-6">
        <header>
          <h1 className="font-heading text-2xl font-semibold text-content sm:text-3xl">
            Профіль
          </h1>
          <p className="mt-1 text-sm text-content-muted sm:text-base">
            Керуйте особистими даними
          </p>
        </header>

        <div className="flex gap-6 flex-wrap ">
          <ProfileBadge />
          <ProfileForm />
        </div>
      </div>
    </UserLayout>
  );
};
