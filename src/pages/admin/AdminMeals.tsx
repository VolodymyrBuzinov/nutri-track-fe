import { adminApi, adminQueryKeys } from "@/api/admin/admin-api";
import {
  AdminTable,
  type AdminTableHead,
  type SortDirection,
} from "@/components/custom/admin/AdminTable";
import { AdminMealIcon } from "@/components/custom/meals/AdminMealIcon";
import { MealPopup } from "@/components/custom/meals/MealPopup";
import { ConfirmationPopup } from "@/components/custom/shared/ConfirmationPopup";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/useDebounce";
import { AdminLayout } from "@/layouts/AdminLayout";
import { handleApiError } from "@/lib/utils";
import { queryClient } from "@/queryClient";
import type { Meal } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MoreVertical, Plus, Search } from "lucide-react";
import { useState } from "react";

interface GetMealsTableHeadProps {
  deleteMeal: (mealId: string) => void;
  editMeal: (mealId: string) => void;
}

const getMealsTableHead = ({
  deleteMeal,
  editMeal,
}: GetMealsTableHeadProps): AdminTableHead<Meal>[] => {
  return [
    {
      key: "name",
      name: "Страва",
      isSortable: true,
      render: (meal) => (
        <AdminMealIcon iconUrl={meal.imageUrl} name={meal.name} />
      ),
    },
    {
      key: "type",
      name: "Тип",
      isSortable: true,
      render: (meal) => meal.type,
    },
    {
      key: "calories",
      name: "Калорії",
      render: (meal) => `${meal.composition.calories} ккал`,
    },
    {
      key: "protein",
      name: "Білки",
      render: (meal) => `${meal.composition.protein} г`,
    },
    {
      key: "fat",
      name: "Жири",
      render: (meal) => `${meal.composition.fat} г`,
    },
    {
      key: "carbohydrates",
      name: "Вуглеводи",
      render: (meal) => `${meal.composition.carbohydrates} г`,
    },
    {
      key: "actions",
      name: "Дії",
      render: (meal) => (
        <Popover>
          <PopoverTrigger className="cursor-pointer">
            <MoreVertical />
          </PopoverTrigger>
          <PopoverContent>
            <Button variant="outline" onClick={() => editMeal(meal.id)}>
              Редагувати
            </Button>
            <Button variant="destructive" onClick={() => deleteMeal(meal.id)}>
              Вилучити
            </Button>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};

export const AdminMeals = () => {
  const [sortBy, setSortBy] = useState<"name" | "type">("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [search, setSearch] = useState("");
  const [isMealPopupOpen, setIsMealPopupOpen] = useState(false);
  const [mealToEdit, setMealToEdit] = useState<Meal>();
  const debouncedSearch = useDebounce(search.trim());
  const [deleteMealId, setDeleteMealId] = useState<string>("");

  const { data: meals = [], isPending } = useQuery({
    queryKey: [
      adminQueryKeys.get_meals,
      sortBy,
      sortDirection,
      debouncedSearch,
    ],
    queryFn: () =>
      adminApi.getMeals({
        sortBy,
        sortOrder: sortDirection,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      }),
    select: (response) => response.data.data,
  });

  const { mutate: deleteMealMutation } = useMutation({
    mutationFn: (mealId: string) => adminApi.deleteMeal(mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [adminQueryKeys.get_meals],
      });
      toast.add({
        title: "Страва успішно вилучена",
        type: "success",
      });
      setDeleteMealId("");
    },
    onError: handleApiError,
  });

  const handleSort = (key: string, direction: SortDirection) => {
    if (key !== "name" && key !== "type") return;

    setSortBy(key);
    setSortDirection(direction);
  };

  const editMeal = (mealId: string) => {
    const meal = meals.find((item) => item.id === mealId);
    if (!meal) return;

    setMealToEdit(meal);
    setIsMealPopupOpen(true);
  };

  const openCreateMealPopup = () => {
    setMealToEdit(undefined);
    setIsMealPopupOpen(true);
  };

  return (
    <AdminLayout>
      <section className="py-6 flex flex-col flex-1">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-content">
              Страви
            </h1>
            <p className="mt-1 text-sm text-content-muted">
              Переглядайте та керуйте стравами.
            </p>
            <InputGroup className="mt-4 w-full max-w-md">
              <InputGroupAddon>
                <Search className="size-4" aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                placeholder="Пошук за назвою"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </InputGroup>
          </div>
          <Button
            className="w-full shrink-0 sm:w-auto"
            onClick={openCreateMealPopup}
          >
            <Plus aria-hidden="true" />
            Додати страву
          </Button>
        </div>

        <AdminTable
          data={meals}
          getRowKey={(meal) => meal.id}
          head={getMealsTableHead({
            deleteMeal: (mealId) => setDeleteMealId(mealId),
            editMeal,
          })}
          sort={{ key: sortBy, direction: sortDirection }}
          onSort={handleSort}
          emptyMessage="Страв не знайдено"
          isPending={isPending}
        />
        <MealPopup
          open={isMealPopupOpen}
          onOpenChange={setIsMealPopupOpen}
          meal={mealToEdit}
        />
        <ConfirmationPopup
          open={!!deleteMealId}
          onOpenChange={() => setDeleteMealId("")}
          onConfirm={() => deleteMealMutation(deleteMealId)}
          title="Вилучити страву"
          description="Ви впевнені, що хочете вилучити цю страву?"
        />
      </section>
    </AdminLayout>
  );
};
