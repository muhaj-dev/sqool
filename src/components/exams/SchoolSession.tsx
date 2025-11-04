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
// import { createPayment } from '@/utils/api';
import { IStudent } from '@/types';
import { Plus } from 'lucide-react';
// import { TermAndSessionForm } from '../admin/compulsory/TermAndSessionForm';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from '../ui/separator';
import { DatePickerAdmin } from '../admin/compulsory/DatePickerAdmin';
import { useToast } from "@/components/ui/use-toast"
import { useCompulsory } from "@/contexts/compulsory-context"
import { createSessionAndTerms } from "@/utils/api"
import { format } from "date-fns"

const formSchema = z.object({
  session: z.string().min(1, "Session is required"),
  firstTermStartDate: z.date({ required_error: "First term start date is required" }),
  firstTermEndDate: z.date({ required_error: "First term end date is required" }),
  secondTermStartDate: z.date({ required_error: "Second term start date is required" }),
  secondTermEndDate: z.date({ required_error: "Second term end date is required" }),
  thirdTermStartDate: z.date({ required_error: "Third term start date is required" }),
  thirdTermEndDate: z.date({ required_error: "Third term end date is required" }),
})


// Generate session options from 10 years back to current year
const generateSessionOptions = () => {
  const currentYear = new Date().getFullYear()
  const options: string[] = []
  for (let i = currentYear - 10; i <= currentYear; i++) {
    options.push(`${i}/${i + 1}`)
  }
  return options
}

interface SchoolSessionProps {
  students: IStudent[];
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SchoolSession() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    userId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentStatus: 'paid',
    amount: ''
  });

    const { toast } = useToast()
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        session: "",
      },
    })
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        const formattedData = {
          session: values.session,
          firstTermStartDate: format(values.firstTermStartDate, "yyyy-MM-dd"),
          firstTermEndDate: format(values.firstTermEndDate, "yyyy-MM-dd"),
          secondTermStartDate: format(values.secondTermStartDate, "yyyy-MM-dd"),
          secondTermEndDate: format(values.secondTermEndDate, "yyyy-MM-dd"),
          thirdTermStartDate: format(values.thirdTermStartDate, "yyyy-MM-dd"),
          thirdTermEndDate: format(values.thirdTermEndDate, "yyyy-MM-dd"),
        }
  
        
        await createSessionAndTerms(formattedData)
        
        toast({
          variant: "default",
          title: "Success",
          description: "Session and terms submitted successfully!",
        })
      setOpen(false);

        // goNextStep(activeIndex)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to submit",
        })
      }
    }
  

 

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await createPayment({
//         paymentMemo: selectedFile,
//         userId: paymentForm.userId,
//         paymentDate: paymentForm.paymentDate,
//         paymentStatus: paymentForm.paymentStatus,
//         amount: paymentForm.amount
//       });

//       toast({
//         variant: "default",
//         title: "Success",
//         description: "Payment created successfully!",
//       });

//     //   setRefresh(!refresh);
//       setOpen(false);
//       setSelectedFile(null);
//       setPaymentForm({
//         userId: '',
//         paymentDate: new Date().toISOString().split('T')[0],
//         paymentStatus: 'paid',
//         amount: ''
//       });

//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to create payment",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };


  return (
    <Dialog 
        open={open} 
        onOpenChange={setOpen}
        >
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary-hover text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create school session for exam
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create school session for exam</DialogTitle>
          <DialogDescription>
            Create a new school session for exam 
          </DialogDescription>
        </DialogHeader>
       
       
        <Form {...form}>
             <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="bg-white p-8 flex flex-col gap-4 mb-8 rounded-md"
             >
               <div className="flex justify-between flex-col md:flex-row">
                 <div>
                   <h3 className="font-semibold">School Session</h3>
                   <p className="text-muted-foreground">
                     Select the academic session for your school
                   </p>
                 </div>
                 <FormField
                   control={form.control}
                   name="session"
                   render={({ field }) => (
                     <FormItem className="w-fit md:w-[60%]">
                       <FormLabel>Select Session</FormLabel>
                       <Select
                         onValueChange={field.onChange}
                         defaultValue={field.value}
                       >
                         <FormControl>
                           <SelectTrigger>
                             <SelectValue placeholder="Select academic session" />
                           </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                           {generateSessionOptions().map((session) => (
                             <SelectItem key={session} value={session}>
                               {session}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
               </div>
               
               <Separator className="my-4 h-[2px]" />
               
               {/* First Term */}
               <div className="flex justify-between my-4 flex-col md:flex-row">
                 <div className="w-full md:w-fit">
                   <h3 className="font-semibold">First Term Dates</h3>
                   <p className="text-muted-foreground">
                     Set the start and end dates for first term
                   </p>
                 </div>
                 <div className="flex items-center gap-4 w-full md:w-[60%]">
                   <FormField
                     control={form.control}
                     name="firstTermStartDate"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Start Date</FormLabel>
                         <FormControl>
                           <DatePickerAdmin 
                             title="Start Date" 
                             date={field.value}
                             onSelect={field.onChange}
                           />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="firstTermEndDate"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>End Date</FormLabel>
                         <FormControl>
                           <DatePickerAdmin 
                             title="End Date" 
                             date={field.value}
                             onSelect={field.onChange}
                           />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>
               </div>
       
               {/* Second Term */}
               <div className="flex justify-between my-4 flex-col md:flex-row">
                 <div>
                   <h3 className="font-semibold">Second Term Dates</h3>
                   <p className="text-muted-foreground">
                     Set the start and end dates for second term
                   </p>
                 </div>
                 <div className="flex items-center gap-4 w-full md:w-[60%]">
                   <FormField
                     control={form.control}
                     name="secondTermStartDate"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Start Date</FormLabel>
                         <FormControl>
                           <DatePickerAdmin 
                             title="Start Date" 
                             date={field.value}
                             onSelect={field.onChange}
                           />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="secondTermEndDate"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>End Date</FormLabel>
                         <FormControl>
                           <DatePickerAdmin 
                             title="End Date" 
                             date={field.value}
                             onSelect={field.onChange}
                           />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>
               </div>
       
               {/* Third Term */}
               <div className="flex justify-between my-4 flex-col md:flex-row">
                 <div>
                   <h3 className="font-semibold">Third Term Dates</h3>
                   <p className="text-muted-foreground">
                     Set the start and end dates for third term
                   </p>
                 </div>
                 <div className="flex items-center gap-4 w-full md:w-[60%]">
                   <FormField
                     control={form.control}
                     name="thirdTermStartDate"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Start Date</FormLabel>
                         <FormControl>
                           <DatePickerAdmin 
                             title="Start Date" 
                             date={field.value}
                             onSelect={field.onChange}
                           />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="thirdTermEndDate"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>End Date</FormLabel>
                         <FormControl>
                           <DatePickerAdmin 
                             title="End Date" 
                             date={field.value}
                             onSelect={field.onChange}
                           />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>
               </div>
       
               <Button type="submit" className="w-[60%] self-end text-white">
                 Submit
               </Button>
             </form>
           </Form>
      </DialogContent>
    </Dialog>
  );
}