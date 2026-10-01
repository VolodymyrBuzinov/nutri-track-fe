import { MealsSection } from "@/components/custom/meals/MealsSection";
import { DailyNorms } from "@/components/custom/user/DailyNorms";
import { MealPlan } from "@/components/custom/user/MealPlan";
import { Recommendations } from "@/components/custom/user/Recommendations";
import { WaterBalance } from "@/components/custom/user/WaterBalance";
import { UserLayout } from "@/layouts/UserLayout";
import { MealsSearch } from "@/components/custom/meals/MealsSearch";

export const UserDashboard = () => {
  return (
    <UserLayout mainClassName="space-y-6">
      <DailyNorms />
      <MealPlan />
      <section
        aria-labelledby="recommendations-title"
        className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <Recommendations />
          <WaterBalance />
        </div>
      </section>
      <MealsSearch />
      <MealsSection />
    </UserLayout>
  );
};
