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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import DatePicker from "../DatePicker";
import AttachmentUpload from "../AttachmentUpload";
import React, { useState } from "react";
import { useOnboarding } from "@/contexts/onboarding-context";
import { OwnerInformation } from "@/types/onboarding";
import { Trash2, Edit } from "lucide-react";

interface OwnerInfoFormProps {
  initialData: OwnerInformation[];
  onPrev: () => void;
}



const formSchema = z.object({
  firstName: z.string({ required_error: "First name is required" }).min(2).max(50),
  lastName: z.string({ required_error: "Last name is required" }).min(2).max(50),
  country: z.string({ required_error: "Country is required" }).min(2),
  nationality: z.string({ required_error: "Nationality is required" }).min(2),
  address: z.string({ required_error: "Residential address is required" }).min(2),
  phoneNumber: z.string({ required_error: "Phone number is required" }).min(2).max(50),
  email: z.string().email({ message: "Invalid email address" }),
  gender: z.string({ required_error: "Gender is required" }).min(2),
  idCard: z.object({
    idType: z.string().min(2, { message: "ID type is required" }),
    idNumber: z.string({ required_error: "ID number is required" }).min(2),
  }),
  dob: z.date({ required_error: "Please select a date" }),
});

const OwnerInfoForm = ({ initialData, onPrev }: OwnerInfoFormProps) => {
  const { 
    formData,
    updateFormData,
    goNextPage,
    goPrevPage,
    updateCompletionState 
  } = useOnboarding();
  
  // const [isVisible, setIsVisible] = useState(false);

  const [owners, setOwners] = useState<OwnerInformation[]>(
    Array.isArray(formData.OwnerInformation) 
      ? formData.OwnerInformation 
      : formData.OwnerInformation 
        ? [formData.OwnerInformation] 
        : initialData
  );
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentOwnerIndex, setCurrentOwnerIndex] = useState<number | null>(null);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      country: "Nigeria",
      nationality: "Nigeria",
      address: "",
      phoneNumber: "",
      email: "",
      gender: "",
      idCard: {
        idType: "",
        idNumber: "",
      },
      dob: undefined,
    },
  });



  const handleAddOwner = () => {
    form.reset();
    setIsEditing(true);
    setCurrentOwnerIndex(null);
  };

  const handleEditOwner = (index: number) => {
    const owner = owners[index];
    form.reset({
      ...owner,
      dob: owner.dob ? new Date(owner.dob) : undefined,
    });
    setIsEditing(true);
    setCurrentOwnerIndex(index);
  };

  const handleDeleteOwner = (index: number) => {
    const newOwners = [...owners];
    newOwners.splice(index, 1);
    setOwners(newOwners);
    updateFormData('OwnerInformation', newOwners);
  };


  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const ownerData: OwnerInformation = {
      ...data,
      dob: data.dob.toISOString(),
      idCard: {
        idType: data.idCard.idType,
        idNumber: data.idCard.idNumber,
      },
    };

    let newOwners = [...owners];
    if (currentOwnerIndex !== null) {
      newOwners[currentOwnerIndex] = ownerData;
    } else {
      newOwners.push(ownerData);
    }

    setOwners(newOwners);
    updateFormData('OwnerInformation', newOwners);
    setIsEditing(false);
    setCurrentOwnerIndex(null);
  };

  const handleSaveAndContinue = () => {
    updateCompletionState("Owner Information");
    goNextPage();
  };



  // const handleSubmit = (data: z.infer<typeof formSchema>) => {
  //   const ownerData: OwnerInformation = {
  //     ...data,
  //     dob: data.dob.toISOString(), // Convert to ISO string
  //     idCard: {
  //       idType: data.idCard.idType,
  //       idNumber: data.idCard.idNumber,
  //     },
  //   };
    
  //   updateFormData('OwnerInformation', ownerData);
  //   console.log(ownerData)
  //   console.log(formData)

  //   updateCompletionState("Owner Information");
  //   goNextPage();
  // };

  return (
    <div className="bg-white rounded-md py-4 mt-8">
      <div className="flex items-center flex-wrap gap-3 justify-between border-b-2 pb-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold">
            Tell us about the School Owner
          </h3>
          <p className="text-sm text-muted-foreground">
            This is Business Owner information that you can update anytime.
          </p>
        </div>
        <Button 
          className="bg-primaryColor text-white"
          // onClick={() => setIsVisible(true)}
          onClick={handleAddOwner}
        >
          Add School Owner
        </Button>
      </div>
      
      {/* {isVisible ? ( */}
      {isEditing ? (

        <div className="flex md:flex-row flex-col gap-3 sm:w-[95%] justify-between mt-12">
          <div className="w-full flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold">
          Tell us about the business owner
        </h3>
        <p className="text-sm text-muted-foreground">
          This must be the name on your registration documentation.
        </p>
      </div>
      {currentOwnerIndex && (
        <Button
          variant="ghost"
          size="icon"
          className="border-[#E9EBEB] rounded-md ml-4"
          onClick={() => {
            handleDeleteOwner(currentOwnerIndex);
            setIsEditing(false);
          }}
        >
          <Trash2 className="h-4 w-4 text-[#515B6F]" />
        </Button>
      )}
    </div>
          
          <div className="w-full md:w-[60%]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Legal Firstname</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter first name"
                            {...field}
                            type="text"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Legal Lastname</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter last name"
                            {...field}
                            type="text"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Select defaultValue="+234">
                            <SelectTrigger className="w-[80px] rounded-r-none bg-[#FAFAFA]">
                              <SelectValue placeholder="+234" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="+234">+234</SelectItem>
                                <SelectItem value="+1">+1</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Phone Number"
                            {...field}
                            className="rounded-l-none"
                            type="tel"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter email"
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <DatePicker
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              form.setValue("dob", date);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Nationality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="nigerian">Nigerian</SelectItem>
                          {/* <SelectItem value="ghanaian">Ghanaian</SelectItem>
                          <SelectItem value="other">Other</SelectItem> */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="nigeria">Nigeria</SelectItem>
                          {/* <SelectItem value="ghana">Ghana</SelectItem>
                          <SelectItem value="other">Other</SelectItem> */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Residential Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter address"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <FormField
                    control={form.control}
                    name="idCard.idType"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Form of ID</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select ID" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="national_id">National ID</SelectItem>
                            <SelectItem value="voters_card">Voter&apos;s Card</SelectItem>
                            <SelectItem value="drivers_license">Driver&apos;s License</SelectItem>
                            <SelectItem value="international_passport">International Passport</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="idCard.idNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>ID Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter ID number"
                            {...field}
                            type="text"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* <AttachmentUpload /> */}

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Button 
                    type="button"
                    variant="outline"
                    // onClick={goPrevPage}
                    onClick={() => setIsEditing(false)}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 text-white text-lg"
                  >
                    Save and Continue
                  </Button>
                  {/* <Button
                    type="button"
                    className="flex-1 bg-white font-semibold hover:bg-gray-200"
                    onClick={() => setIsVisible(false)}
                  >
                    Cancel
                  </Button> */}
                </div>
              </form>
            </Form>
          </div>
        </div>
      ) : (
        <div className="mt-6">
        {owners.length > 0 && (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold">School Owners</h3>
              <p className="text-sm text-muted-foreground">
                Personal information of the business Owner(s)
              </p>
            </div>
            
            <div className="space-y-4">
              {owners.map((owner, index) => (
                <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{owner.firstName} {owner.lastName}</h4>
                    <p className="text-sm w-5/6 text-muted-foreground">
                      {/* {owner.phoneNumber} • {owner.email} */}
                      Personal information of the business Owner(s)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      // variant="ghost"
                      className="bg-primaryColor text-white"
                      // size="icon"
                      onClick={() => handleEditOwner(index)}
                    >
                      Edit Information
                    </Button>
               
                    <Button
                      variant="ghost"
                      size="icon"
                      className="border-[#E9EBEB] rounded-md"
                      onClick={() => handleDeleteOwner(index)}
                    >
                      <Trash2 className="h-4 w-4 text-[#515B6F]" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleSaveAndContinue}
                className="text-white text-lg"
              >
                Save and Continue
              </Button>
            </div>
          </>
        )}
      </div>
      )}
    </div>
  );
};

export default OwnerInfoForm;




