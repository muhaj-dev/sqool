'use client'


import { useState, useEffect } from 'react';
import { DataTable } from '../ui/data-table';
import { StatusBadge } from '../ui/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Plus, TrendingUp, TrendingDown, DollarSign, ChevronRight } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { getBanks } from "@/utils/api";
import { IBankAccount, IStudent } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { AccountAddModal } from './AccountAddModal';
import { getPayments } from '@/utils/api';
import { PaymentAddModal } from './PaymentAddModal';
import { getAllStudents } from '@/utils/api';

interface Payment {
  _id: string;
  paymentMemo: string;
  userId: string;
  paymentDate: string;
  paymentStatus: 'paid' | 'not paid' | 'processing' | 'Success' | 'Failed' | 'Processing';
  amount: number;
  student?: {
    firstName: string;
    lastName: string;
  };
}

interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
}

const expenseCategories = [
  'Staff',
  'Infrastructure',
  'Maintenance',
  'Supplies',
  'Transport',
  'Utilities',
  'Other'
];

// Bank Account List Component
const BankAccountList = ({ banks }: { banks: IBankAccount[] }) => {
  const [selectedBank, setSelectedBank] = useState<IBankAccount | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <Card className="bg-white rounded-md mt-4">
      <CardHeader>
        <CardTitle>Bank Accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {banks.map((item, ind) => (
          <Dialog key={ind} open={selectedBank?._id === item._id && deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <div 
                className="bg-[#F2F2F280] cursor-pointer flex items-center pr-2 justify-between p-3 rounded-md"
                onClick={() => setSelectedBank(item)}
              >
                <div className="flex items-center gap-2">
                  <span>{item.bankName}</span>
                  <span className="text-[#828282]">
                    {item.accountNumber}
                  </span>
                </div>
                <ChevronRight />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Bank Account</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this bank account?
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>Account Name: {item.accountName}</p>
                <p>Account Number: {item.accountNumber}</p>
                <p>Bank Name: {item.bankName}</p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive">
                    Delete
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </CardContent>
    </Card>
  )
}

export default function Account() {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [banks, setBanks] = useState<IBankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBanks, setShowBanks] = useState(false);
  const [addExpenseDialog, setAddExpenseDialog] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    name: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);

  // Fetch banks on component mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setLoading(true);
        const response = await getBanks();
        setBanks(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch banks');
      } finally {
        setLoading(false);
      }
    };
    fetchBanks();
  }, [refresh]);

  // Fetch payments and students
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [paymentsResponse, studentsResponse] = await Promise.all([
          getPayments(1, 100),
          getAllStudents(100, '')
        ]);
        
        // Adjust based on your actual API response structure
        setPayments(paymentsResponse.data?.result || paymentsResponse.data || []);
        setStudents(studentsResponse.data?.result || studentsResponse.data || []);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh, toast]);

  const totalPayments = payments
    .filter(p => p.paymentStatus === 'paid' || p.paymentStatus === 'Success')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalPayments - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const paymentColumns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'paymentDate',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.paymentDate);
        return <div className="text-sm">{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: 'studentName',
      header: 'Student Name',
      cell: ({ row }) => {
        const payment = row.original;
        const student = students.find(s => s._id === payment.userId);
        return <div className="font-medium">{student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}</div>;
      },
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge status={row.original.paymentStatus} />
      ),
  // paymentStatus: 'paid' | 'not paid' | 'processing' | 'Success' | 'Failed' | 'Processing';

    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = row.original.amount;
        return <div className="font-medium">{formatCurrency(amount)}</div>;
      },
    },
  ];

  const expenseColumns: ColumnDef<Expense>[] = [
    {
      accessorKey: 'name',
      header: 'Expense Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.original.category}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = row.original.amount;
        return <div className="font-medium">{formatCurrency(amount)}</div>;
      },
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        return <div className="text-sm">{date.toLocaleDateString()}</div>;
      },
    },
  ];

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expenseForm.name || !expenseForm.category || !expenseForm.amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      name: expenseForm.name,
      category: expenseForm.category,
      amount: parseFloat(expenseForm.amount),
      date: expenseForm.date
    };

    setExpenses([...expenses, newExpense]);
    setAddExpenseDialog(false);
    setExpenseForm({
      name: '',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    });

    toast({
      title: 'Success',
      description: 'Expense added successfully',
    });
  };

  const toggleShowBanks = () => {
    setShowBanks(!showBanks);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="px-6 space-y-6">
      <div className="flex justify-between items-center flex-wrap">
        <div>
          <p className="text-2xl font-[600]">Account</p>
        </div>
        <Dialog open={showAccountModal} onOpenChange={setShowAccountModal}>
          <DialogTrigger 
            className="flex items-center bg-primaryColor text-white py-2 px-4 text-sm rounded-md cursor-pointer my-4"
            onClick={() => setShowAccountModal(true)}
          >
            <Plus /> <p>Add Bank Account</p>
          </DialogTrigger>
          <AccountAddModal 
            setRefresh={setRefresh} 
            refresh={refresh} 
            showAccountModal={showAccountModal}
            setShowAccountModal={setShowAccountModal}
          />
        </Dialog>
      </div>

      {/* View Available Banks Link */}
      <div className="text-right">
        <button
          onClick={toggleShowBanks}
          className="text-lg font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <motion.span 
            className="border-b-2 border-primary pb-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showBanks ? 'Hide Available Banks' : 'View Available Banks'}
          </motion.span>
        </button>
      </div>

      {/* Bank Accounts List */}
      <AnimatePresence>
        {showBanks && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BankAccountList banks={banks} />
          </motion.div>
        )}
      </AnimatePresence>
  

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total School Payments
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(totalPayments)}
            </div>
            <p className="text-xs text-success/70 mt-1">
              From {payments.filter(p => p.paymentStatus === 'Success').length} successful payments
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-destructive/70 mt-1">
              From {expenses.length} expense entries
            </p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br border ${
          netBalance >= 0 
            ? 'from-primary/5 to-primary/10 border-primary/20' 
            : 'from-destructive/5 to-destructive/10 border-destructive/20'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Balance
            </CardTitle>
            <DollarSign className={`h-4 w-4 ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              netBalance >= 0 ? 'text-primary' : 'text-destructive'
            }`}>
              {formatCurrency(netBalance)}
            </div>
            <p className={`text-xs mt-1 ${
              netBalance >= 0 ? 'text-primary/70' : 'text-destructive/70'
            }`}>
              {netBalance >= 0 ? 'Positive balance' : 'Negative balance'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* School Fees Table */}
       <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">School Fees</h3>
          <div className="flex gap-2">
            <PaymentAddModal 
              students={students} 
              refresh={refresh} 
              setRefresh={setRefresh} 
            />
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
        
        <DataTable
          columns={paymentColumns}
          data={payments}
          searchKey="studentName"
         
          filterOptions={[
            {
              key: 'paymentStatus',
              label: 'Status',
              options: [
                { label: 'Paid', value: 'paid' },
                { label: 'Not Paid', value: 'not paid' },
                { label: 'Processing', value: 'processing' },
              ],
            },
          ]}
          
      
        />
      </div>

      {/* Expenses Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Expenses</h3>
          <Dialog open={addExpenseDialog} onOpenChange={setAddExpenseDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-hover text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Add a new expense to track your school spending
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <Label htmlFor="expense-name">Expense Name *</Label>
                  <Input
                    id="expense-name"
                    value={expenseForm.name}
                    onChange={(e) => setExpenseForm(prev => ({...prev, name: e.target.value}))}
                    placeholder="e.g., Office Supplies"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="expense-category">Category *</Label>
                  <Select
                    value={expenseForm.category}
                    onValueChange={(value) => setExpenseForm(prev => ({...prev, category: value}))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="expense-amount">Amount (₦) *</Label>
                  <Input
                    id="expense-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm(prev => ({...prev, amount: e.target.value}))}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="expense-date">Date</Label>
                  <Input
                    id="expense-date"
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm(prev => ({...prev, date: e.target.value}))}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setAddExpenseDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-primary hover:bg-primary-hover text-primary-foreground"
                  >
                    Add Expense
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <DataTable
          columns={expenseColumns}
          data={expenses}
          searchKey="name"
          filterOptions={[
            {
              key: 'category',
              label: 'Category',
              options: expenseCategories.map(cat => ({
                label: cat,
                value: cat
              })),
            },
          ]}
        />
      </div>
    </div>
  );
}