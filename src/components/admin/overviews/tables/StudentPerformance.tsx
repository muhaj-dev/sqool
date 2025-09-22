"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"

interface StudentPerformanceTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export default function StudentPerformance<TData, TValue>({
  columns,
  data,
}: StudentPerformanceTableProps<TData, TValue>) {
  useEffect(() => table.setPageSize(5), [])
  const [sorting, setSorting] = useState<SortingState>([])
  const [filtering, setFiltering] = useState("")
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  })
  return (
    <div className="overflow-y-auto mt-4 bg-white rounded-md p-4  h-[540px] no-scrollbar">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold">Top Student Performance</h2>
        <Input
          type="text"
          value={filtering}
          onChange={e => setFiltering(e.target.value)}
          className="w-[200px]"
        />
      </div>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex gap-4 mt-4 items-center mb-8">
        <button
          onClick={() => table.previousPage()}
          className={`py-2 px-4 border outline-none rounded-md ${
            table.getCanPreviousPage() ? "border-primaryColor" : ""
          } `}
        >
          Previous Page
        </button>
        <button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          className={`py-2 px-4 border outline-none rounded-md ${
            table.getCanNextPage() ? "border-primaryColor" : ""
          } `}
        >
          Next Page
        </button>
      </div>
    </div>
  )
}
