import { adminApi, adminQueryKeys } from "@/api/admin/admin-api";
import {
  AdminTable,
  type AdminTableHead,
  type SortDirection,
} from "@/components/custom/AdminTable";
import { UserAvatar } from "@/components/custom/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AdminLayout } from "@/layouts/AdminLayout";
import { queryClient } from "@/queryClient";
import type { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

interface GetUsersTableHeadProps {
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const getUsersTableHead = ({
  onEditUser,
  onDeleteUser,
}: GetUsersTableHeadProps): AdminTableHead<User>[] => {
  return [
    {
      key: "name",
      name: "Користувач",
      isSortable: true,
      render: (user) => (
        <div className="flex items-center gap-3 font-medium text-content">
          <UserAvatar avatarUrl={user.avatarUrl} name={user.name} />
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
    {
      key: "actions",
      name: "Дії",
      render: (user) => (
        <Popover>
          <PopoverTrigger>
            <MoreVertical />
          </PopoverTrigger>
          <PopoverContent>
            <Button variant="outline" onClick={() => onEditUser(user)}>
              Редагувати
            </Button>
            <Button variant="destructive" onClick={() => onDeleteUser(user.id)}>
              Вилучити
            </Button>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};

export const AdminUsers = () => {
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedUser, setSelectedUser] = useState<User>();
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

  const { mutate: deleteUser } = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [adminQueryKeys.get_users, sortDirection],
      });
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
          head={getUsersTableHead({
            onEditUser: (user) => setSelectedUser(user),
            onDeleteUser: (userId) => deleteUser(userId),
          })}
          sort={{ key: "name", direction: sortDirection }}
          onSort={(_, direction) => setSortDirection(direction)}
          emptyMessage="Користувачів не знайдено"
          isPending={isPending}
        />
      </section>
      <Dialog
        open={!!selectedUser}
        onOpenChange={() => {
          setSelectedUser(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редагувати користувача</DialogTitle>
            <DialogDescription>
              Редагуйте інформацію про користувача.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};
