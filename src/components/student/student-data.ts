interface IStudent {
  id: string
  fullname: string
  class: string
  rate: number
  subject: string
}

export interface ILibrary {
  id: string
  date: string
  bookName: string
  author: string
  class: string
  type: string
  // action: string
}

export interface IParentExp {
  id: number
  date: string
  expenses: string
  amount: string
  status: string
  action: string
}

export interface IPayment {
  id: number
  date: string
  counterparty: string
  paymentMemo: string
  amount: string
  type: string
  action: string
}


export const paymentData: IPayment[] = [
  {
    id: 1,
    date: "13 July, 2021",
    counterparty: "Samuel Woodfree",
    paymentMemo: "Good banger",
    type: "Pending",
    amount: "4345.00",
    action: "..."
  },
  {
    id: 2,
    date: "13 July, 2021",
    counterparty: "Samuel Woodfree",
    paymentMemo: "Good banger",
    type: "Pending",
    amount: "4345.00",
    action: "..."
  },
  {
    id: 3,
    date: "13 July, 2021",
    counterparty: "Samuel Woodfree",
    paymentMemo: "Good banger",
    type: "Paid",
    amount: "4345.00",
    action: "View payment, Delete payment"
  },
  {
    id: 4,
    date: "13 July, 2021",
    counterparty: "Samuel Woodfree",
    paymentMemo: "Good banger",
    type: "Paid",
    amount: "4345.00",
    action: "View payment, Delete payment"
  },
  {
    id: 5,
    date: "13 July, 2021",
    counterparty: "Samuel Woodfree",
    paymentMemo: "Good banger",
    type: "Pending",
    amount: "4345.00",
    action: "..."
  },
  {
    id: 6,
    date: "13 July, 2021",
    counterparty: "Samuel Woodfree",
    paymentMemo: "Good banger",
    type: "Pending",
    amount: "4345.00",
    action: "..."
  },
  {
    id: 7,
    date: "13 July, 2021",
    counterparty: "Samuel Woodfree",
    paymentMemo: "Good banger",
    type: "Due",
    amount: "4345.00",
    action: "..."
  },
  {
    id: 8,
    date: "13 July, 2021",
    counterparty: "Samuel Woodfree",
    paymentMemo: "Good banger",
    type: "Pending",
    amount: "4345.00",
    action: "..."
  }
];


export const parentData: IParentExp[] = [
  {
    id: 1,
    date: "13 July, 2021",
    expenses: "Exam Fee",
    amount: "250000",
    status: "Paid",
    action: "Download Receipt",
  },
  {
    id: 2,
    date: "13 July, 2021",
    expenses: "Exam Fee",
    amount: "250000",
    status: "Due",
    action: "Download Receipt",
  },
  {
    id: 3,
    date: "13 July, 2021",
    expenses: "Exam Fee",
    amount: "250000",
    status: "Paid",
    action: "Download Receipt",
  },
  {
    id: 4,
    date: "13 July, 2021",
    expenses: "Exam Fee",
    amount: "250000",
    status: "Paid",
    action: "Download Receipt",
  },
  {
    id: 5,
    date: "13 July, 2021",
    expenses: "Exam Fee",
    amount: "250000",
    status: "Due",
    action: "Download Receipt",
  }
];


export const libraryData: ILibrary[] = [
  {
    id: "1",
    date: "Jake Gyll",
    bookName: "SS3A",
    author: "John Doe",
    class: "Art",
    type: "Art",
  },
  {
    id: "2",
    date: "Jake Gyll",
    bookName: "SS3A",
    author: "Emily Smith",
    class: "Art",
    type: "Art",
  },
  {
    id: "3",
    date: "Jake Gyll",
    bookName: "SS3A",
    author: "Michael Johnson",
    class: "Art",
    type: "Art",
  },
  {
    id: "4",
    date: "Jake Gyll",
    bookName: "SS3A",
    author: "Sarah Brown",
    class: "Art",
    type: "Art",
  },
  {
    id: "5",
    date: "Jake Gyll",
    bookName: "SS3A",
    author: "David Wilson",
    class: "Art",
    type: "Art",
  },
  {
    id: "6",
    date: "Jake Gyll",
    bookName: "SS3A",
    author: "Jessica Taylor",
    class: "Art",
    type: "Art",
  },
  {
    id: "7",
    date: "Jake Gyll",
    bookName: "SS3A",
    author: "Daniel Anderson",
    class: "Art",
    type: "Art",
  },
  {
    id: "8",
    date: "Jake Gyll",
    bookName: "SS3A",
    author: "Laura Thomas",
    class: "Art",
    type: "Art",
  },
  {
    id: "9",
    date: "Jake Gyll",
    bookName: "SS3A",
    author: "Robert Martinez",
    class: "Art",
    type: "Art",
  },
  {
    id: "10",
    date: "Jake Gyll",
    bookName: "SS3A",
    author: "Emily Davis",
    class: "Art",
    type: "Art",
  },
];


export const data: IStudent[] = [
  {
    id: "1",
    fullname: "Jake Gyll",
    class: "SS3A",
    rate: 85,
    subject: "Art",
  },
  {
    id: "2",
    fullname: "Jake Gyll",
    class: "SS3A",
    rate: 85,
    subject: "Art",
  },
  {
    id: "3",
    fullname: "Jake Gyll",
    class: "SS3A",
    rate: 85,
    subject: "Art",
  },
  {
    id: "4",
    fullname: "Jake Gyll",
    class: "SS3A",
    rate: 85,
    subject: "Art",
  },
  {
    id: "5",
    fullname: "Jake Gyll",
    class: "SS3A",
    rate: 85,
    subject: "Art",
  },
  {
    id: "6",
    fullname: "Jake Gyll",
    class: "SS3A",
    rate: 85,
    subject: "Art",
  },
  {
    id: "7",
    fullname: "Jake Gyll",
    class: "SS3A",
    rate: 85,
    subject: "Art",
  },
  {
    id: "8",
    fullname: "Jake Gyll",
    class: "SS3A",
    rate: 85,
    subject: "Art",
  },
  {
    id: "9",
    fullname: "Jake Gyll",
    class: "SS3A",
    rate: 85,
    subject: "Art",
  },
  {
    id: "10",
    fullname: "Jake Gyll",
    class: "SS3A",
    rate: 85,
    subject: "Art",
  },
]

export const maleStudent = [
  {
    id: "1",
    fullname: "Adekunle Ajasin",
    class: "SS3A",
    rate: 85,
    subject: "Art",
  },
  {
    id: "2",
    fullname: "Ayodeji Quadri",
    class: "SS3B",
    rate: 62,
    subject: "Art",
  },
  {
    id: "3",
    fullname: "Ogunsoke John",
    class: "SS3D",
    rate: 85,
    subject: "Commercial",
  },
  {
    id: "4",
    fullname: "Ifatola Michael",
    class: "SS3A",
    rate: 55,
    subject: "Scient",
  },
  {
    id: "5",
    fullname: "Ojerinde Paul",
    class: "SS3b",
    rate: 95,
    subject: "Science",
  },
 
]

export const femaleStudent = [
  {
    id: "1",
    fullname: "Adekunle Opemipo",
    class: "SS3A",
    rate: 85,
    subject: "Art",
  },
  {
    id: "2",
    fullname: "Ayodeji Comfort",
    class: "SS3B",
    rate: 62,
    subject: "Art",
  },
  {
    id: "3",
    fullname: "Olawale Marry",
    class: "SS3D",
    rate: 85,
    subject: "Commercial",
  },
  {
    id: "4",
    fullname: "Aduragbemi Ajoke",
    class: "SS3A",
    rate: 55,
    subject: "Scient",
  },
  {
    id: "5",
    fullname: "Ogooluwa Blessing",
    class: "SS3b",
    rate: 95,
    subject: "Science",
  },
 
]
