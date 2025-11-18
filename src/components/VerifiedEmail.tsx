"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import MaxWidthWrapper from "./MaxWidthWrapper";
import Requirement from "./Requirement";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";

// import { registerUser, sendOTP } from "./Api";

const VerifiedEmail = () => {
  const navigation = useRouter();
  // const user = useUserStore((state) => state.user);
  // const clearUser = useUserStore((state) => state.clearUser);
  const [resend, setResend] = useState(false);
  const resendHandler = () => {
    setTimeout(() => {
      setResend(true);
    }, 300);
    navigation.push("/onboarding");
  };

  // const handleVerifyOTP = async (otp: string) => {
  //   console.log("Verifying OTP:", otp); // Log the OTP being verified

  //   // Call your API to verify OTP
  //   const isVerified = await sendOTP(otp); // Implement this function

  //   console.log("OTP verification result:", isVerified); // Log the result of OTP verification

  //   // if (isVerified) {
  //   //   // Get the user from the Zustand store
  //   //   const user = useUserStore.getState().user; // Access the user from the store
  //   //   console.log("User  data retrieved from store:", user); // Log the user data

  //   //   if (user) {
  //   //     // Check if user is not null
  //   //     // Send POST request to register the user
  //   //     const registrationResult = await registerUser(user); // Now user is guaranteed to be of type User
  //   //     console.log("User  registration result:", registrationResult); // Log the result of registration

  //   //     clearUser(); // Clear user data from store
  //   //     navigation.push("/onboarding"); // Redirect to onboarding page
  //   //   } else {
  //   //     // Handle the case where user is null
  //   //     console.error("User  data is not available. Please try again."); // Log an error
  //   //     alert("User  data is not available. Please try again.");
  //   //   }
  //   // } else {
  //   //   // Handle OTP verification failure
  //   //   console.error("OTP verification failed. Please try again."); // Log an error
  //   //   alert("OTP verification failed. Please try again.");
  //   // }
  // };

  return (
    <MaxWidthWrapper>
      <div className="flex justify-between items-center w-full">
        <Link
          href={"/"}
          className="uppercase text-[#E5B80B] text-md font-bold sm:text-3xl hover:cursor-pointer  transition "
        >
          Sqoolify
        </Link>
      </div>

      <div className="flex justify-center items-center flex-col w-full mt-20">
        <Dialog>
          <div className="flex flex-col justify-center items-center max-w-[450px] w-full">
            {/* <div className="flex justify-center items-center flex-col w-full h-screen">
        <Dialog>
          <div className="flex flex-col justify-center items-center w-[500px]"> */}

            <div className=" rounded-full overflow-hidden">
              <Image
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                src={require("../../public/images/illustration.jpg")}
                alt="label"
                width={100}
                height={100}
              />
            </div>
            <p className="text-2xl text-primary font-bold">Verify your Email</p>
            <span className="text-muted-foreground ">
              We have sent a confirmation email to the address you provided. This verification link
              is only good for 24 hours.
            </span>
            <div className="mt-12 w-full">
              <DialogTrigger asChild>
                <Button className="bg-primary font-semibold text-white w-full py-4 shadow-lg">
                  View Requirement
                </Button>
              </DialogTrigger>
              <Button
                // onClick={resendHandler}
                variant={"outline"}
                className="w-full text-primary mt-4 hover:text-yellow-500"
              >
                {resend ? "Resending..." : "Resend Link"}
              </Button>
            </div>
          </div>
          <Requirement />
        </Dialog>
      </div>
    </MaxWidthWrapper>
  );
};

export default VerifiedEmail;
