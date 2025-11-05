'use client'

import * as React from 'react'
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Input } from '@/components/ui/input'

const data: Period[] = [
  {
    id: 1,
    time: '9:40 am - 10: 20 am',
    img: '/assests/avatar.png',
    subject: 'Physics',
    topic: 'Nuclear Boom',
    status: 'Absent',
  },
  {
    id: 2,
    time: '9:40 am - 10: 20 am',
    img: '/assests/avatar.png',
    subject: 'Physics',
    topic: 'Nuclear Boom',
    status: 'Absent',
  },
  {
    id: 3,
    time: '9:40 am - 10: 20 am',
    img: '/assests/avatar.png',
    subject: 'Physics',
    topic: 'Nuclear Boom',
    status: 'Present',
  },
  {
    id: 4,
    time: '9:40 am - 10: 20 am',
    img: '/assests/avatar.png',
    subject: 'Physics',
    topic: 'Nuclear Boom',
    status: 'Present',
  },
  {
    id: 5,
    time: '9:40 am - 10: 20 am',
    img: '/assests/avatar.png',
    subject: 'Physics',
    topic: 'Nuclear Boom',
    status: 'Absent',
  },
]

export type Period = {
  id: number
  time: string
  img: string
  subject: string
  topic: string
  status: 'Absent' | 'Present'
}

export const columns: ColumnDef<Period>[] = [
  {
    accessorKey: 'img',
    header: 'Image',
    cell: ({ row }) => (
      <div>
        <Image src={row.getValue('img')} alt="Avatar" width={40} height={40} className="rounded-full" />
      </div>
    ),
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => <div className="capitalize">{row.getValue('subject')}</div>,
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => <div className="capitalize">{row.getValue('time')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status')
      return (
        <div className="flex gap-4">
          <div className="capitalize w-[110px] bg-[#20C9AC1A] text-[#20C9AC] py-2 px-5 rounded-md flex justify-center items-center">
            {status === 'Absent' ? <Attended /> : 'Absent'}
          </div>
          <div className="capitalize w-[110px] bg-[#FC34001A] text-[#FC3400] py-2 px-5 rounded-md flex justify-center items-center">
            {status === 'Present' ? <Cancel /> : 'Present'}
          </div>
        </div>
      )
    },
  },
]

export function ATable() {
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
      <div className="flex justify-between">
        <Input
          type="text"
          placeholder="Search..."
          icon={<Search />} // Icon passed as prop
          className="my-2 w-[250px]"
        />
        <Button className="flex gap-3 text-white">
          <Upload /> Export
        </Button>
      </div>
      <div>
        <Table>
          {/* <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="bg-[#F2F2F2] hover:bg-[#F2F2F2]"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader> */}
          <TableBody className="">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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

const Export = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.23852 14.8117C5.63734 16.3002 6.51616 17.6154 7.73867 18.5535C8.96118 19.4915 10.4591 20 12 20C13.5409 20 15.0388 19.4915 16.2613 18.5535C17.4838 17.6154 18.3627 16.3002 18.7615 14.8117"
      stroke="white"
    />
    <path
      d="M12 4L11.6877 3.60957L12 3.35969L12.3123 3.60957L12 4ZM12.5 13C12.5 13.2761 12.2761 13.5 12 13.5C11.7239 13.5 11.5 13.2761 11.5 13L12.5 13ZM6.68765 7.60957L11.6877 3.60957L12.3123 4.39043L7.31235 8.39043L6.68765 7.60957ZM12.3123 3.60957L17.3123 7.60957L16.6877 8.39043L11.6877 4.39043L12.3123 3.60957ZM12.5 4L12.5 13L11.5 13L11.5 4L12.5 4Z"
      fill="white"
    />
  </svg>
)

const Attended = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.5" cy="10.5" r="5.25" fill="#7E869E" fill-opacity="0.25" />
    <path d="M4.5 9.75L7.5 12L12.75 5.25" stroke="#20C9AC" stroke-width="1.2" />
  </svg>
)

const Cancel = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="10" r="6.75" fill="#7E869E" fill-opacity="0.25" />
    <path d="M6.75 12.2498L11.25 7.74976" stroke="#FD4B1C" stroke-width="1.2" />
    <path d="M11.25 12.25L6.75 7.75" stroke="#FD4B1C" stroke-width="1.2" />
  </svg>
)

export const Search = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="6" stroke="#222222" />
    <path d="M20 20L17 17" stroke="#222222" strokeLinecap="round" />
  </svg>
)

const Upload = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.23852 14.8117C5.63734 16.3002 6.51616 17.6154 7.73867 18.5535C8.96118 19.4915 10.4591 20 12 20C13.5409 20 15.0388 19.4915 16.2613 18.5535C17.4838 17.6154 18.3627 16.3002 18.7615 14.8117"
      stroke="white"
    />
    <path
      d="M12 4L11.6877 3.60957L12 3.35969L12.3123 3.60957L12 4ZM12.5 13C12.5 13.2761 12.2761 13.5 12 13.5C11.7239 13.5 11.5 13.2761 11.5 13L12.5 13ZM6.68765 7.60957L11.6877 3.60957L12.3123 4.39043L7.31235 8.39043L6.68765 7.60957ZM12.3123 3.60957L17.3123 7.60957L16.6877 8.39043L11.6877 4.39043L12.3123 3.60957ZM12.5 4L12.5 13L11.5 13L11.5 4L12.5 4Z"
      fill="white"
    />
  </svg>
)
