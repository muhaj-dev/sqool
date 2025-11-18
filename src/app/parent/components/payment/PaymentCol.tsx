import { type ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown, MoreHorizontal } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { type IPayment } from "@/types";

export const PaymentCol: ColumnDef<IPayment>[] = [
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
    accessorKey: "counterparty",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Counterparty
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("counterparty")}</div>,
  },
  {
    accessorKey: "paymentMemo",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Payment Memo
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("paymentMemo")}</div>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          type
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const typeValue = row.getValue("type"); // Ensure it's a string

      // Determine background color based on the type value
      const bgColor =
        typeValue === "Due"
          ? "bg-[#DC3545] text-white"
          : typeValue === "Pending"
            ? "text-[#FFD03A] bg-[#FFD03A] bg-opacity-30"
            : "bg-[#19B257] text-white";

      return (
        <div className={`px-2 py-1 rounded-full capitalize text-center w-[80px] ${bgColor}`}>
          {typeValue as string}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Amount
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => <div className="capitalize">N {row.getValue("amount")}</div>,
  },
  {
    accessorKey: "action",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex gap-1 items-center"
        >
          Action
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const actionValue = row.getValue("action"); // Explicitly cast to 'string'

      return (
        <button className="flex items-start gap-4 cursor-pointer">
          ...
          <MoreHorizontal size={20} className="text-muted-foreground" />
        </button>
      );
    },
  },
];
