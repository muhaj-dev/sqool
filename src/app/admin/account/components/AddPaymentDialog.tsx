// components/payment/AddPaymentDialog.tsx
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IStudent, PaymentFormData } from '@/types'

interface AddPaymentDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isLoading: boolean
  students: IStudent[]
  studentSearch: string
  setStudentSearch: (search: string) => void
  isSearching: boolean
  selectedStudent: IStudent | null
  onStudentSelect: (student: IStudent) => void
  formData: PaymentFormData
  onInputChange: (field: string, value: string | File | null) => void
  onAddPayment: () => void
  onResetForm: () => void
}

export const AddPaymentDialog = ({
  isOpen,
  onOpenChange,
  isLoading,
  students,
  studentSearch,
  setStudentSearch,
  isSearching,
  selectedStudent,
  onStudentSelect,
  formData,
  onInputChange,
  onAddPayment,
  onResetForm
}: AddPaymentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record New Payment</DialogTitle>
          <DialogDescription>Add a new payment record manually</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Student Search */}
          <div className="relative">
            <Label>Student *</Label>
            <Input
              placeholder="Search student by name..."
              value={studentSearch}
              onChange={e => setStudentSearch(e.target.value)}
            />
            {students?.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {students.map(student => (
                  <div
                    key={student?._id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => onStudentSelect(student)}
                  >
                    <div className="font-medium">
                      {student?.firstName} {student?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {student?.class?.className || 'No grade'} • {student?._id}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {isSearching && (
              <div className="absolute right-3 top-8">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              </div>
            )}
            {selectedStudent && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  Selected:{' '}
                  <strong>
                    {selectedStudent?.firstName} {selectedStudent?.lastName}
                  </strong>
                </p>
              </div>
            )}
          </div>

          <div>
            <Label>Amount Paid (₦) *</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.amountPaid}
              onChange={e => onInputChange('amountPaid', e.target.value)}
            />
          </div>

          <div>
            <Label>Payment Method *</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={value => onInputChange('paymentMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="pos">POS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Payment Status *</Label>
            <Select
              value={formData.paymentStatus}
              onValueChange={value => onInputChange('paymentStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="not paid">Not paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Payment Type *</Label>
            <Select
              value={formData.paymentType}
              onValueChange={value => onInputChange('paymentType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Payment Category *</Label>
            <Select
              value={formData.paymentCategory}
              onValueChange={value => onInputChange('paymentCategory', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="school_fee">School Fee</SelectItem>
                <SelectItem value="registration">Registration</SelectItem>
                <SelectItem value="exam_fee">Exam Fee</SelectItem>
                <SelectItem value="pta_dues">PTA Dues</SelectItem>
                <SelectItem value="staff_salary">Staff Salary</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="transport_fee">Transport Fee</SelectItem>
                <SelectItem value="hostel_fee">Hostel Fee</SelectItem>
                <SelectItem value="uniforms">Uniforms</SelectItem>
                <SelectItem value="books_and_supplies">Books & Supplies</SelectItem>
                <SelectItem value="extra_curricular">Extra Curricular</SelectItem>
                <SelectItem value="event_fee">Event Fee</SelectItem>
                <SelectItem value="donation">Donation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Transaction ID (Optional)</Label>
            <Input
              placeholder="Enter transaction ID"
              value={formData.transactionId}
              onChange={e => onInputChange('transactionId', e.target.value)}
            />
          </div>

          <div>
            <Label>Payment Date *</Label>
            <Input
              type="date"
              value={formData.paymentDate}
              onChange={e => onInputChange('paymentDate', e.target.value)}
            />
          </div>

          <div>
            <Label>Payment Memo *</Label>
            <Input type="file" onChange={e => onInputChange('paymentMemo', e.target.files?.[0] || null)} />
            <p className="text-sm text-muted-foreground mt-1">Required field, but can be empty</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              onResetForm()
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={onAddPayment} disabled={isLoading || !selectedStudent}>
            {isLoading ? 'Recording...' : 'Record Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}