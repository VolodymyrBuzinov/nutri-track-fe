import { adminApi, adminQueryKeys } from "@/api/admin/admin-api";
import {
  AdminTable,
  type AdminTableHead,
  type SortDirection,
} from "@/components/custom/admin/AdminTable";
import { CreateUserPopup } from "@/components/custom/admin/CreateUserPopup";
import { ConfirmationPopup } from "@/components/custom/shared/ConfirmationPopup";
import { UserAvatar } from "@/components/custom/user/UserAvatar";
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
import { AdminLayout } from "@/layouts/AdminLayout";
import { useDebounce } from "@/hooks/useDebounce";
import { queryClient } from "@/queryClient";
import type { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MoreVertical, Search, UserPlus } from "lucide-react";
import { useState } from "react";

interface GetUsersTableHeadProps {
  onDeleteUser: (userId: string) => void;
}

const getUsersTableHead = ({
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
          <PopoverTrigger className="cursor-pointer">
            <MoreVertical />
          </PopoverTrigger>
          <PopoverContent>
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
  const [deleteUserId, setDeleteUserId] = useState<string>();
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const debouncedSearchEmail = useDebounce(searchEmail.trim());

  const { data: users = [], isPending } = useQuery({
    queryKey: [adminQueryKeys.get_users, sortDirection, debouncedSearchEmail],
    queryFn: async () => {
      const response = await adminApi.getUsers({
        sortBy: "name",
        sortOrder: sortDirection,
        ...(debouncedSearchEmail ? { email: debouncedSearchEmail } : {}),
      });

      return response.data.data;
    },
  });

  const { mutate: deleteUser, isPending: isDeletingUser } = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [adminQueryKeys.get_users],
      });
      setDeleteUserId(undefined);
    },
  });

  return (
    <AdminLayout>
      <section className="py-6 flex flex-col flex-1">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-content">
              Користувачі
            </h1>
            <p className="mt-1 text-sm text-content-muted">
              Керуйте обліковими записами користувачів.
            </p>
            <InputGroup className="mt-4 w-full max-w-md">
              <InputGroupAddon>
                <Search className="size-4" aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                placeholder="Пошук за email"
                value={searchEmail}
                onChange={(event) => setSearchEmail(event.target.value)}
              />
            </InputGroup>
          </div>
          <Button
            className="w-full shrink-0 sm:w-auto"
            onClick={() => setIsCreateUserOpen(true)}
          >
            <UserPlus aria-hidden="true" />
            Створити користувача
          </Button>
        </div>

        <AdminTable
          data={users}
          getRowKey={(user) => user.id}
          head={getUsersTableHead({
            onDeleteUser: (userId) => setDeleteUserId(userId),
          })}
          sort={{ key: "name", direction: sortDirection }}
          onSort={(_, direction) => setSortDirection(direction)}
          emptyMessage="Користувачів не знайдено"
          isPending={isPending}
        />
      </section>
      <CreateUserPopup
        open={isCreateUserOpen}
        onOpenChange={setIsCreateUserOpen}
      />
      <ConfirmationPopup
        open={!!deleteUserId}
        onOpenChange={() => setDeleteUserId(undefined)}
        title="Вилучити користувача"
        description="Ви впевнені, що хочете вилучити цього користувача?"
        onConfirm={() => deleteUserId && deleteUser(deleteUserId)}
        isLoading={isDeletingUser}
      />
    </AdminLayout>
  );
};
