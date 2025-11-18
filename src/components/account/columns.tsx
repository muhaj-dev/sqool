import { type ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import Action from "./Action";

export interface Payment {
  id: string;
  date: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  name: string;
  bank: string;
}

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    name: "Abel Coma",
    bank: "First Bank",
    date: "13 July, 2021",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    name: "John Doe",
    bank: "Opay",
    date: "24 October, 2022",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    name: "John Wick",
    bank: "Palmpay",
    date: "24 July, 2022",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    name: "Paul Silas",
    bank: "GTB",
    date: "31 August, 2024",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    name: "Clatrine Rebecca",
    bank: "First Bank",
    date: " 27 February, 2023",
  },
];

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="border-muted-foreground"
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="border-muted-foreground"
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
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("date")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "bank",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bank Name
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("bank")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("amount")}</div>,
  },
  {
    accessorKey: "action",
    header: "Action",
    id: "actions",
    cell: Action,
  },
];
