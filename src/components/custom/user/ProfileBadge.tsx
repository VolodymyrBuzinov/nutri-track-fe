import { useAuth } from "@/context/authContext";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { CalendarDays, Trash2, Upload } from "lucide-react";
import { UserAvatar } from "@/components/custom/user/UserAvatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import localLoader from "@/assets/local-loader.svg";
import type { User } from "@/types";
import { handleApiError } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { userApi, userQueryKeys } from "@/api/user/user-api";
import { queryClient } from "@/queryClient";
import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/lib/consts";
import { useRef } from "react";

export const ProfileBadge = () => {
  const { currentUser } = useAuth();
  const user = currentUser.account as User;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadAvatar, isPending: isUploading } = useMutation({
    mutationFn: userApi.uploadUserAvatar,
    onSuccess: (data) => {
      queryClient.setQueryData([userQueryKeys.getUser], {
        type: "user",
        account: { ...user, avatarUrl: data?.data?.data?.avatarUrl ?? "" },
      });
      toast.add({ title: "Фото профілю оновлено", type: "success" });
    },
    onError: handleApiError,
  });

  const { mutate: deleteAvatar, isPending: isDeleting } = useMutation({
    mutationFn: userApi.deleteUserAvatar,
    onSuccess: () => {
      toast.add({ title: "Фото профілю видалено", type: "success" });
    },
    onError: handleApiError,
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    uploadAvatar(file);
  };
  const isAvatarBusy = isUploading || isDeleting;
  return (
    <aside className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <UserAvatar
            avatarUrl={user.avatarUrl}
            name={user.name}
            size={112}
            className="size-28 min-h-28 min-w-28 text-3xl"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-1 right-1 size-4 rounded-full border-2 border-white bg-emerald-500"
          />
          {isAvatarBusy ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/70">
              <img
                src={localLoader}
                alt=""
                aria-hidden="true"
                className="size-8"
              />
            </div>
          ) : null}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_IMAGE_MIME_TYPES.join(",")}
          className="sr-only"
          onChange={(event) => {
            event.target.value = "";
          }}
        />

        <Button
          type="button"
          variant="outline"
          className="mt-5 w-full"
          disabled={isAvatarBusy}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload aria-hidden="true" />
          Змінити фото
        </Button>

        {user.avatarUrl ? (
          <Button
            type="button"
            variant="link"
            className="mt-2 h-auto px-0 text-content-muted hover:text-destructive"
            disabled={isAvatarBusy}
            onClick={() => deleteAvatar()}
          >
            <Trash2 aria-hidden="true" />
            Видалити фото
          </Button>
        ) : null}

        <p className="mt-2 text-xs text-content-muted">
          JPG, PNG або WebP • до {MAX_IMAGE_SIZE_BYTES / (1024 * 1024)} МБ
        </p>
      </div>

      <Separator className="my-5" />

      <div className="space-y-2 text-center">
        <p className="font-heading text-lg font-semibold text-content">
          {user.name}
        </p>
        <p className="text-sm text-content-muted">{user.email}</p>
        <p className="inline-flex items-center justify-center gap-2 text-sm text-content-muted">
          <CalendarDays className="size-4 shrink-0" aria-hidden="true" />З нами
          з{" "}
          {format(new Date(user.createdAt), "d MMMM yyyy", {
            locale: uk,
          })}
        </p>
      </div>
    </aside>
  );
};
