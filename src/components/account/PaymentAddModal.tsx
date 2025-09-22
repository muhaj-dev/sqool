"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { createPayment } from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';
import { IStudent } from '@/types';
import { Plus } from 'lucide-react';

interface PaymentAddModalProps {
  students: IStudent[];
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PaymentAddModal({ students, refresh, setRefresh }: PaymentAddModalProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    userId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentStatus: 'paid',
    amount: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createPayment({
        paymentMemo: selectedFile,
        userId: paymentForm.userId,
        paymentDate: paymentForm.paymentDate,
        paymentStatus: paymentForm.paymentStatus,
        amount: paymentForm.amount
      });

      toast({
        variant: "default",
        title: "Success",
        description: "Payment created successfully!",
      });

      setRefresh(!refresh);
      setOpen(false);
      setSelectedFile(null);
      setPaymentForm({
        userId: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentStatus: 'paid',
        amount: ''
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create payment",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Add Payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
          <DialogDescription>
            Record a new school fee payment for a student
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="student">Student *</Label>
            <Select
              value={paymentForm.userId}
              onValueChange={(value) => handleChange('userId', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student._id} value={student._id}>
                    {`${student.firstName} ${student.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount (₦) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={paymentForm.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="paymentDate">Payment Date *</Label>
            <Input
              id="paymentDate"
              type="date"
              value={paymentForm.paymentDate}
              onChange={(e) => handleChange('paymentDate', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="paymentStatus">Payment Status *</Label>
            <Select
              value={paymentForm.paymentStatus}
              onValueChange={(value) => handleChange('paymentStatus', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="not paid">Not Paid</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="paymentMemo">Payment Memo (File) *</Label>
            <Input
              id="paymentMemo"
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
              required
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white"
              disabled={loading || !selectedFile}
            >
              {loading ? 'Processing...' : 'Add Payment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}