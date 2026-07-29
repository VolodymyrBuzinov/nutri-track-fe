import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "@/components/custom/shared/Loader";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Inbox } from "lucide-react";
import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc";

export interface AdminTableHead<T> {
  key: string;
  name: string;
  render: (item: T) => ReactNode;
  isSortable?: boolean;
  className?: string;
}

interface AdminTableProps<T> {
  data: T[];
  getRowKey: (item: T) => string;
  head: AdminTableHead<T>[];
  sort?: {
    key: string;
    direction: SortDirection;
  };
  onSort?: (key: string, direction: SortDirection) => void;
  emptyMessage?: string;
  isPending?: boolean;
}

export const AdminTable = <T,>({
  data,
  getRowKey,
  head,
  sort,
  onSort,
  emptyMessage = "Дані відсутні",
  isPending = false,
}: AdminTableProps<T>) => {
  const handleSort = (column: AdminTableHead<T>) => {
    if (!column.isSortable || !onSort) return;

    const direction =
      sort?.key === column.key && sort.direction === "asc" ? "desc" : "asc";

    onSort(column.key, direction);
  };

  if (!Array.isArray(data)) return null;

  const showEmptyState = !isPending && !data.length;
  const showData = !!data.length;

  return (
    <div className="relative min-h-50 h-max overflow-hidden rounded-xl flex-1 border border-border bg-white shadow-sm">
      <ScrollArea className="!absolute top-0 left-0 w-full h-full">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="hover:bg-transparent">
              {head.map((column) => {
                const isActiveSort = sort?.key === column.key;

                return (
                  <TableHead
                    key={column.key}
                    aria-sort={
                      isActiveSort
                        ? sort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : column.isSortable
                        ? "none"
                        : undefined
                    }
                    className={cn(
                      "h-11 px-4 text-xs font-semibold text-content",
                      column.className
                    )}
                  >
                    {column.isSortable ? (
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-sm transition-colors hover:text-main focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        onClick={() => handleSort(column)}
                      >
                        {column.name}
                        {isActiveSort &&
                          (sort.direction === "asc" ? (
                            <ChevronUp className="size-4" aria-hidden="true" />
                          ) : (
                            <ChevronDown
                              className="size-4"
                              aria-hidden="true"
                            />
                          ))}
                      </button>
                    ) : (
                      column.name
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {showEmptyState ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={head.length}
                  className="text-center text-content-muted"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Inbox
                      className="size-10"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : null}
            {showData
              ? data.map((item) => (
                  <TableRow key={getRowKey(item)} className="h-16 bg-white">
                    {head.map((column) => (
                      <TableCell
                        key={column.key}
                        className={cn(
                          "px-4 py-3 text-sm text-content-muted",
                          column.className
                        )}
                      >
                        {column.render(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </ScrollArea>
      {isPending ? (
        <div className="absolute inset-0 z-10 bg-white/70 flex items-center justify-center">
          <Loader type="local" size={48} className="min-h-0" />
        </div>
      ) : null}
    </div>
  );
};
