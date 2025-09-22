import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { IParentExp } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"

export const ParentExpCol: ColumnDef<IParentExp>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
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
      )
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("date")}</div>
    ),
  },
  {
    accessorKey: "expenses",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Expenses
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("expenses")}</div>,
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
    )
  },
  cell: ({ row }) => (
    <div className="lowercase">{row.getValue("amount")}</div>
  ),
},
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Status
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell: ({ row }) => {
        const statusValue = row.getValue("status") as string; // Ensure it's a string
    
        // Determine background color based on the status value
        const bgColor =
        statusValue === "Due"
            ? "bg-[#DC3545] text-white" // Red background for 'Due'
            : "bg-[#19B257] text-white" // Green background for 'Paid'
    
        return (
          <div
            className={`px-2 py-1 rounded-full capitalize text-center w-[80px] ${bgColor}`}
          >
            {statusValue}
          </div>
        );
      },
  },
 
  {
    accessorKey: "action",
    header: ({ column }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-end"
          >
            Action
          <ChevronsUpDown className="ml-2 h-4 w-4" />

          </div>
        )
      },
    cell: ({ row }) => {
      const actionValue = row.getValue("action") as string; // Explicitly cast to 'string'
  
      return (
        <button className="flex items-start gap-4 cursor-pointer">
          <p className="text-primaryColor bg-[#FFD03A1A] rounded-[20px] px-4 py-2 cursor-pointer">
            {actionValue || "Download Receipt"} {/* Fallback to a default if necessary */}
          </p>
          <MoreHorizontal size={20} className="text-muted-foreground" />
        </button>
      );
    },
  }
]
