"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import OtpInput from "react-otp-input";
import { useAuthStore } from "@/zustand/authStore";

export default function VerifyPhoneNumber() {
  const router = useRouter();
  const { toast } = useToast();
  const { verifyOtpAndRegister, tempPhone, isLoading, error } = useAuthStore();
  const [otp, setOtp] = useState("");


  const handleVerify = async () => {
    try {
      const success = await verifyOtpAndRegister(otp);
      if (success) {
        toast({
          variant: "default",
          title: "Success",
          description: "Registration successful!",
          duration: 3000,
        });
        router.push("/onboarding");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Registration failed. Please try again.",
        duration: 3000,
      });
    }
  };


  const maskPhoneNumber = (phone: string | null) => {
    if (!phone || phone.length < 7) return phone;
    return phone.slice(0, 4) + "****" + phone.slice(-3);
  };

  return (
    <div style={styles.container}>
      <div className="flex flex-col items-center">
        <h2 className="text-primary font-bold text-[28px]">
          Verify your Phone number
        </h2>
        <p className="text-[#515B6F] font-normal text-[18px]">
          We sent an OTP to{" "}
          {tempPhone ? maskPhoneNumber(tempPhone) : "your number"} via SMS and
          WhatsApp.
        </p>
      </div>

      <div>
        <span>Enter OTP Code</span>
        <OtpInput
          containerStyle="flex gap-[1.5rem] justify-center items-center"
          value={otp}
          onChange={setOtp}
          inputType="text"
          numInputs={4}
          renderSeparator={<span></span>}
          renderInput={(props) => (
            <input
              {...props}
              style={styles.input}
              className="w-[9rem] text-[1.5rem] text-center border-2 border-[#ccc] rounded-[5px] m-0 mx-1"
            />
          )}
          placeholder="0000"
          onPaste={(e) => e.preventDefault()}
        />
        <div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button
            onClick={handleVerify}
            className="bg-primary mt-4 font-semibold text-white w-full py-4 shadow-lg"
            disabled={isLoading || otp.length !== 4}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
          <small>
            Didn’t get the code? <span>Click Resend</span>
          </small>
        </div>
      </div>
      <div>
        <p>
          Still not received your OTP? Kindly cross-check your phone number by
          clicking here.
        </p>
      </div>
    </div>
  );
}


const styles = {
  container: {
    display: "flex",
    gap: "2rem",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column" as "column",
    height: "100vh",
  },
  input: {
    width: "58px",
    height: "58px",
    fontSize: "1.5rem",
    textAlign: "center" as "center",
    border: "2px solid #ccc",
    borderRadius: "5px",
    margin: "0 5px",
  },
};




// console.error("Error sending OTP:", error);