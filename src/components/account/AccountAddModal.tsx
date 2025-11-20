"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { createBankAccount } from "@/utils/api";

const formSchema = z.object({
  account_name: z.string().min(5, {
    message: "Account name must be at least 5 characters",
  }),
  account_no: z
    .string()
    .min(10, { message: "Account number must be at least 10 digits" })
    .max(20, { message: "Account number cannot exceed 20 digits" })
    .regex(/^\d+$/, { message: "Account number must contain only numbers" }),
  bank_name: z.string().min(2, {
    message: "Please select a bank",
  }),
});

export function AccountAddModal({
  refresh,
  setRefresh,
  showAccountModal,
  setShowAccountModal,
}: {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  showAccountModal: boolean;
  setShowAccountModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account_name: "",
      account_no: "",
      bank_name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const bankAccountData = {
        accountName: values.account_name,
        bankName: values.bank_name,
        accountNumber: values.account_no,
      };

      await createBankAccount(bankAccountData);

      toast({
        variant: "default",
        title: "Success",
        description: "Bank account added successfully!",
      });
      setRefresh(!refresh);
      setShowAccountModal(false);
      // Reset form after successful submission
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add bank account",
      });
    }
  }

  if (!showAccountModal) return null;

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <DialogContent className="sm:max-w-[40%] rounded-none">
          <DialogClose className="outline-none border-none absolute bg-white -top-16 right-0 rounded-full w-10 h-10">
            X
          </DialogClose>
          <DialogHeader className="flex flex-col items-center w-[100%] mx-auto my-4">
            <DialogTitle className="text-primary font-semibold text-xl mb-2">
              Add Bank Account
            </DialogTitle>
            <DialogDescription className="text-center">
              Provide your bank account details to receive payments. Ensure the account name matches
              the name on your official documentation.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <Label htmlFor="bank_name" className="">
                      Bank Name
                    </Label>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full bg-[#E9EBEB]">
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="First Bank">First Bank</SelectItem>
                          <SelectItem value="EcoBank">EcoBank</SelectItem>
                          <SelectItem value="Wema Bank">Wema Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="account_no"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <Label htmlFor="account_no" className="">
                      Account Number
                    </Label>
                    <FormControl>
                      <Input
                        id="account_no"
                        placeholder="Account Number"
                        className="bg-[#E9EBEB]"
                        inputMode="numeric"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="account_name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <Label htmlFor="account_name" className="">
                      Account Name
                    </Label>
                    <FormControl>
                      <Input
                        id="account_name"
                        placeholder="Account name"
                        className="bg-[#E9EBEB]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Button type="submit" className="w-full p-2 outline-none text-white">
                  Save Bank Account
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </div>
    </div>
  );
}
