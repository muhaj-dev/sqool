'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { createBankAccount } from '@/utils/api'
import { useToast } from '@/components/ui/use-toast'

const formSchema = z.object({
  bankName: z.string().min(2, {
    message: 'Please select a bank',
  }),
  accountNumber: z
    .string()
    .min(10, { message: 'Account number must be at least 10 digits' })
    .max(20, { message: 'Account number cannot exceed 20 digits' })
    .regex(/^\d+$/, { message: 'Account number must contain only numbers' }),
  accountName: z.string().min(5, {
    message: 'Account name must be at least 5 characters',
  }),
})

export function BankInfoForm() {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankName: '',
      accountNumber: '',
      accountName: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const bankAccountData = {
        accountName: values.accountName,
        bankName: values.bankName,
        accountNumber: values.accountNumber,
      }

      await createBankAccount(bankAccountData)

      toast({
        variant: 'default',
        title: 'Success',
        description: 'Bank account added successfully!',
      })

      // Reset form after successful submission
      form.reset()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add bank account',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-8 flex flex-col gap-20 mb-8 rounded-md">
        <div className="flex gap-4 flex-col md:flex-row w-full lg:w-[85%]">
          <div className="max-w-[250px]">
            <h3 className="font-semibold">Enter your School Bank Account</h3>
            <p className="text-muted-foreground">this most be the name on your registration Documentation.</p>
          </div>

          <div className="flex-1 flex flex-col gap-8">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your bank" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="First Bank">First Bank</SelectItem>
                      <SelectItem value="EcoBank">EcoBank</SelectItem>
                      <SelectItem value="Kuda Microfinance">Kuda Microfinance</SelectItem>
                      <SelectItem value="Bank of America">Bank of America</SelectItem>
                      <SelectItem value="Other">Other Bank</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account number" {...field} inputMode="numeric" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account holder name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-white">
              Save Bank Account
            </Button>
          </div>
        </div>
        <div className="flex justify-between flex-col md:flex-row w-full">
          <div className="w-fit md:w-[40%] max-w-[400px]">
            <h3 className="font-semibold">Additional Accounts</h3>
            <p className="text-muted-foreground">Add more bank accounts if needed (optional)</p>
          </div>
          <div className="mx-auto flex items-center text-primary cursor-pointer hover:bg-gray-50 rounded-md p-2">
            <Plus />
            <Button type="button" variant="ghost" className="text-primary hover:bg-transparent">
              Add Another Account
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
