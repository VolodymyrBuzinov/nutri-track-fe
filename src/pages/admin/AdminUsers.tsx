import { adminApi, adminQueryKeys } from "@/api/admin/admin-api";
import {
  AdminTable,
  type AdminTableHead,
  type SortDirection,
} from "@/components/custom/AdminTable";
import { AdminLayout } from "@/layouts/AdminLayout";
import type { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const userTableHead: AdminTableHead<User>[] = [
  {
    key: "name",
    name: "Користувач",
    isSortable: true,
    render: (user) => (
      <div className="flex items-center gap-3 font-medium text-content">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="size-9 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-9 items-center justify-center rounded-full bg-main-soft text-sm font-semibold text-main">
            {user.name.charAt(0).toUpperCase()}
          </span>
        )}
        <span>{user.name}</span>
      </div>
    ),
  },
  {
    key: "email",
    name: "Email",
    render: (user) => user.email,
  },
  {
    key: "gender",
    name: "Стать",
    render: (user) => user.gender || "—",
  },
  {
    key: "age",
    name: "Вік",
    render: (user) => user.age,
  },
  {
    key: "height",
    name: "Зріст",
    render: (user) => `${user.height} см`,
  },
  {
    key: "weight",
    name: "Вага",
    render: (user) => `${user.weight} кг`,
  },
  {
    key: "activityLevel",
    name: "Активність",
    render: (user) => user.activityLevel || "—",
  },
  {
    key: "createdAt",
    name: "Дата реєстрації",
    render: (user) => user.createdAt,
  },
];

export const AdminUsers = () => {
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const { data: users = [], isPending } = useQuery({
    queryKey: [adminQueryKeys.get_users, sortDirection],
    queryFn: async () => {
      const response = await adminApi.getUsers({
        sortBy: "name",
        sortOrder: sortDirection,
      });

      return response.data.data;
    },
  });

  return (
    <AdminLayout>
      <section className="py-6 flex flex-col flex-1">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold text-content">
            Користувачі
          </h1>
          <p className="mt-1 text-sm text-content-muted">
            Керуйте обліковими записами користувачів.
          </p>
        </div>

        <AdminTable
          data={users}
          getRowKey={(user) => user.id}
          head={userTableHead}
          sort={{ key: "name", direction: sortDirection }}
          onSort={(_, direction) => setSortDirection(direction)}
          emptyMessage="Користувачів не знайдено"
          isPending={isPending}
        />
      </section>
    </AdminLayout>
  );
};
