import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '../ui/checkbox'
import { ChevronsUpDown, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { IStudent } from '@/types'

export const columns: ColumnDef<IStudent>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
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
    accessorKey: 'fullname',
    header: ({ column }) => {
      return (
        <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex items-center">
          Full Name
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('fullname')}</div>,
  },
  {
    accessorKey: 'class',
    header: ({ column }) => {
      return (
        <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex items-center">
          Class
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('class')}</div>,
  },
  {
    accessorKey: 'rate',
    header: ({ column }) => {
      return (
        <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex items-center">
          Rate
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('rate')}</div>,
  },
  {
    accessorKey: 'subject',
    header: ({ column }) => {
      return (
        <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex items-center">
          Subject
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('subject')}</div>,
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => (
      <Link href="  student/1" className="flex items-center gap-2 text-primary cursor-pointer">
        View Detail
        <MoreHorizontal size={20} className="text-muted-foreground" />
      </Link>
    ),
  },
]
