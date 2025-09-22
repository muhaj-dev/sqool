"use client";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import AttachmentUpload from "../AttachmentUpload";
import { Separator } from "../ui/separator";
import { useOnboarding } from "@/contexts/onboarding-context";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  files: z.object({
    cacId: z.instanceof(File).optional(),
    utility: z.instanceof(File).optional(),
  }),
});

const BusinessDocForm = () => {
  const { updateCompletionState, goNextPage, updateFormData } = useOnboarding();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: {
        cacId: undefined,
        utility: undefined,
      },
    },
  });



function onSubmit(data: z.infer<typeof formSchema>) {
  // Prepare the files data
  const uploadedFiles: File[] = [];
  
  if (data.files.cacId) {
    uploadedFiles.push(data.files.cacId);
  }
  if (data.files.utility) {
    uploadedFiles.push(data.files.utility);
  }

  // Update the form data in context (this will append files)
  updateFormData('UploadedFiles', uploadedFiles);
  
  console.log('Submitted files:', uploadedFiles);
  goNextPage();
  updateCompletionState("Business Documentation");
}

  return (
    <div className="bg-white rounded-md p-4 mt-8">
      <div className="flex items-center justify-between border-b-2 pb-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold">
            Please submit your business documentation
          </h3>
          <p className="text-sm text-muted-foreground">
            Ensure the business documentation you are submitting is valid
          </p>
        </div>
      </div>

      <div className="flex sm:w-[95%] justify-between mt-12">
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
              <div className="flex justify-between flex-col md:flex-row gap-2 w-full">
                <div>
                  <h3 className="text-xl font-semibold">Form CAC7</h3>
                  <p className="text-sm text-muted-foreground w-full md:w-[16rem]">
                    The Corporate Affairs Commission (CAC) is the statutory body
                    charged with the administration of the Companies and Allied
                    Matters Act.
                  </p>
                </div>
                <FormField
                  name="files.cacId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Attach your corporate affairs commission
                      </FormLabel>
                      <FormControl>
                        <AttachmentUpload 
                          {...field}
                          onChange={(file) => form.setValue('files.cacId', file)}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="my-6 h-[2px]" />
              <div className="flex justify-between flex-col md:flex-row gap-2 w-full">
                <div>
                  <h3 className="text-xl font-semibold">Utility Bills</h3>
                  <p className="text-sm text-muted-foreground w-full md:w-[16rem]">
                    A utility bill is a monthly statement of the amount a
                    household or School owes for essential services.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="files.utility"
                  render={({ field }) => (
                    <FormItem className="w-full col-span-3">
                      <FormLabel>Attach your utility bills</FormLabel>
                      <FormControl>
                        <AttachmentUpload 
                          {...field}
                          onChange={(file) => form.setValue('files.utility', file)}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="my-6 h-[2px]" />
              <div className="grid grid-cols-1 md:grid-cols-5 w-full">
                <div className="col-span-2"></div>
                <div className="col-span-3">
                  <Button type="submit" className="w-full text-white text-lg">
                    Save and Continue
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BusinessDocForm;