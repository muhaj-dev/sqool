import { type ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { Checkbox } from "@/components/ui/checkbox";
import { type ILibrary } from "@/types";

export const libraryColumns: ColumnDef<ILibrary>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Date
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("date")}</div>,
  },
  {
    accessorKey: "bookName",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Book Name
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("bookName")}</div>,
  },
  {
    accessorKey: "author",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Author
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("author")}</div>,
  },
  {
    accessorKey: "class",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Class
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("class")}</div>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Type
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <Link href="  student/1" className="flex items-center gap-4 cursor-pointer">
        <p className="bg-primary text-white rounded-[20px] px-4 py-2 cursor-pointer">View Detail</p>
        <MoreHorizontal size={20} className="text-muted-foreground" />
      </Link>
    ),
  },
];
