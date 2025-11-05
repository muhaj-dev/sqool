"use client"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import PhoneNumberInput from "@/components/PhoneInput"
import Wrapper from "@/components/Wrapper"
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const FormSchema = z.object({
  phone: z.string().min(3, "Please provide your first name"),
})
const ChangePhonrNumber = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }
  return (
    <MaxWidthWrapper>
      <div>
        <span className="text-primary font-bold sm:text-2xl">SQOOLIFY</span>
      </div>
      <Wrapper className="h-screen sm:w-[60%] w-full  mx-auto gap-4">
        <div className="text-center">
          <h2 className="text-primary text-xl mb-3">Edit phone number</h2>
          <p className="text-[#515B6F]">
            Cross check your number or enter another phone number to receive
            your OTP.
          </p>
        </div>
        <div className="flex items-center w-full  gap-2">
          <Form {...form}>
            <form
              action=""
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-4 sm:gap-6  "
            >
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Phone Number</FormLabel>
                    <PhoneNumberInput field={field} />
                  </FormItem>
                )}
              />
              <Button className="text-white font-semibold bg-primary  w-full mb-4">
                Resend OTP
              </Button>
            </form>
          </Form>
        </div>
      </Wrapper>
      <p className="text-[#8C8C8C] text-sm text-center">
        Terms of service. Having problem with login?
      </p>
    </MaxWidthWrapper>
  );
}

export default ChangePhonrNumber
