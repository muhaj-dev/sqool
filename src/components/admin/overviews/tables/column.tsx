"use client";

import { Button } from "@/components/ui/button";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/*

{"id":1,"first_name":"Melloney","last_name":"Faiers","email":"mfaiers0@paypal.com","gender":"Female","profile":"http://dummyimage.com/237x100.png/dddddd/000000","company_name":"Sales"}

outstanding
{"id":1,"first_name":"Remington","last_name":"Burnage","fee_type":"First Term","profile":"http://dummyimage.com/182x100.png/ff4444/ffffff","fee_amount":319673,"status":"Outstanding","class":"SSS1"},

*/

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface Performance {
  id: number;
  first_name: string;
  last_name: string;
  profile: string;
  class: string;
  percentage: number;
  rank: string;
}

export interface OutstandingFee {
  id: number;
  first_name: string;
  last_name: string;
  fee_type: string;
  profile: string;
  fee_amount: number;
  status: string;
  class: string;
}

export const performanceColumns: ColumnDef<Performance>[] = [
  {
    accessorKey: "id",
    header: "ID",
    footer: "ID",
  },
  {
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorKey: "name",
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    cell: (props) => (
      <div className="flex gap-2">
        <Avatar>
          <AvatarImage src={props.cell.row.original.profile} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span>{`${props.cell.row.original.first_name} ${props.cell.row.original.last_name}`}</span>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Class-</span>
            <span>{`${props.cell.row.original.class}`}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "percentage",
    header: "Percentage",
    cell: (props) => (
      <div className="flex gap-1 w-[45px] h-[45px] items-center ">
        <CircularProgressbar strokeWidth={15} value={Number(props.getValue())} />
        <span>{`${props.getValue()}`}</span>
      </div>
    ),
  },
  {
    accessorKey: "rank",
    header: "Rank",
    cell: (props) => <p>{`${props.getValue()}`}</p>,
  },
];

export const outstandingColumns: ColumnDef<OutstandingFee>[] = [
  {
    accessorKey: "id",
    header: "ID",
    footer: "ID",
  },
  {
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorKey: "name",
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    cell: (props) => (
      <div className="flex gap-2">
        <Avatar>
          <AvatarImage src={props.cell.row.original.profile} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span>{`${props.cell.row.original.first_name} ${props.cell.row.original.last_name}`}</span>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Class-</span>
            <span>{`${props.cell.row.original.class}`}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "fee_type",
    header: "Fee Type",
  },
  {
    accessorKey: "fee_amount",
    header: "Fee Amount",
    cell: (props) => <p>{`$${props.getValue()}`}</p>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (props) => (
      <div className="bg-[rgba(252,52,0,0.10)] py-[10px] px-6 rounded-md text-[#FC3400]">{`${props.getValue()}`}</div>
    ),
  },
];
