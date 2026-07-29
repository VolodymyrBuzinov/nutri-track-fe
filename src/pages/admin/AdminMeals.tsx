import { adminApi, adminQueryKeys } from "@/api/admin/admin-api";
import {
  AdminTable,
  type AdminTableHead,
  type SortDirection,
} from "@/components/custom/admin/AdminTable";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useDebounce } from "@/hooks/useDebounce";
import { AdminLayout } from "@/layouts/AdminLayout";
import type { Meal } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";

const mealsTableHead: AdminTableHead<Meal>[] = [
  {
    key: "name",
    name: "Страва",
    isSortable: true,
    render: (meal) => (
      <div className="flex items-center gap-3 font-medium text-content">
        <img
          src={meal.imageUrl}
          alt=""
          className="size-10 rounded-md object-cover"
        />
        <span>{meal.name}</span>
      </div>
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
];

export const AdminMeals = () => {
  const [sortBy, setSortBy] = useState<"name" | "type">("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim());

  const { data: meals = [], isPending } = useQuery({
    queryKey: [adminQueryKeys.get_meals, sortBy, sortDirection, debouncedSearch],
    queryFn: async () => {
      const response = await adminApi.getMeals({
        sortBy,
        sortOrder: sortDirection,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      });

      return response.data.data;
    },
  });

  const handleSort = (key: string, direction: SortDirection) => {
    if (key !== "name" && key !== "type") return;

    setSortBy(key);
    setSortDirection(direction);
  };

  return (
    <AdminLayout>
      <section className="py-6 flex flex-col flex-1">
        <div className="mb-6">
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

        <AdminTable
          data={meals}
          getRowKey={(meal) => meal.id}
          head={mealsTableHead}
          sort={{ key: sortBy, direction: sortDirection }}
          onSort={handleSort}
          emptyMessage="Страв не знайдено"
          isPending={isPending}
        />
      </section>
    </AdminLayout>
  );
};
