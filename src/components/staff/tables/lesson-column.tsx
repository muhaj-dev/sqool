import { ColumnDef } from "@tanstack/react-table"

export type Lesson = {
  id: number
  date: string
  class: string
  subject: string
  topic: string
  approved_by: string
}

export const columns: ColumnDef<Lesson>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div className="capitalize">{row.getValue("date")}</div>,
  },
  {
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("class")}</div>
    ),
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
    accessorKey: "approved_by",
    header: "Appoved by",
    cell: ({ row }) => (
      <div className="capitalize underline cursor-pointer">
        {row.getValue("approved_by")}
      </div>
    ),
  },
  {
    accessorKey: "attachment",
    header: "Attachment",
    cell: ({ row }) => (
      <div className="capitalize text-primaryColor underline cursor-pointer">
        view link
      </div>
    ),
  },
]
