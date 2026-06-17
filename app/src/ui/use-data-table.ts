import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

/**
 * Shared table wiring: global search + per-column filters + header sorting +
 * client pagination. Screens keep their own bespoke markup and just bind inputs
 * to the returned table instance (table.setGlobalFilter, column.setFilterValue,
 * header.column.getToggleSortingHandler, table.nextPage, ...).
 */
export function useDataTable<T>({
  data,
  columns,
  pageSize = 8,
}: {
  data: T[];
  // biome-ignore lint/suspicious/noExplicitAny: column defs mix accessor/display value types
  columns: ColumnDef<T, any>[];
  pageSize?: number;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  return useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });
}
