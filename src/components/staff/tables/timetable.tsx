"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const data: Period[] = [
  {
    id: 1,
    time: "9:40 am - 10: 20 am",
    subject: "Physics",
    topic: "Nuclear Boom",
    class: "SS1",
    status: "Attend",
  },
  {
    id: 2,
    time: "9:40 am - 10: 20 am",
    subject: "Physics",
    topic: "Nuclear Boom",
    class: "SS1",
    status: "Attend",
  },
  {
    id: 3,
    time: "9:40 am - 10: 20 am",
    subject: "Physics",
    topic: "Nuclear Boom",
    class: "SS1",
    status: "Cancel",
  },
  {
    id: 4,
    time: "9:40 am - 10: 20 am",
    subject: "Physics",
    topic: "Nuclear Boom",
    class: "SS1",
    status: "Up coming",
  },
  {
    id: 5,
    time: "9:40 am - 10: 20 am",
    subject: "Physics",
    topic: "Nuclear Boom",
    class: "SS1",
    status: "Up coming",
  },
]

export type Period = {
  id: number
  time: string
  subject: string
  topic: string
  class: string
  status: "Attend" | "Cancel" | "Up coming"
}

export const columns: ColumnDef<Period>[] = [
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => <div className="capitalize">{row.getValue("time")}</div>,
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("subject")}</div>
    ),
  },
  {
    accessorKey: "topic",
    header: "Topic",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("topic")}</div>
    ),
  },
  {
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("class")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return (
        <>
          {status === "Attend" ? (
            <div className="capitalize bg-[#20C9AC1A] text-[#20C9AC] p-2 rounded-md flex justify-center items-center">
              {row.getValue("status")}
            </div>
          ) : status === "Cancel" ? (
            <div className="capitalize bg-[#FC34001A] text-[#FC3400] p-2 rounded-md flex justify-center items-center">
              {row.getValue("status")}
            </div>
          ) : (
            <div className="capitalize bg-[#00A5FF1A] text-[#00A5FF] p-2 rounded-md flex justify-center items-center">
              {row.getValue("status")}
            </div>
          )}
        </>
      )
    },
  },
]

export function TimeTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center p-4 justify-between">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Today(10/01/24)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">Total Attendance</p>
          <div>100/79</div>
        </div>
      </div>
      <div className="rounded-md  ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                className="bg-[#F2F2F2] hover:bg-[#F2F2F2]"
                key={headerGroup.id}
              >
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
    </div>
  )
}
