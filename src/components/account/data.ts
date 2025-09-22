export type Payment = {
  id: string
  date: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  name: string
  bank: string
}

export const data: Payment[] = [
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
]
