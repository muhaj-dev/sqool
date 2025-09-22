import { useAuthStore } from "@/zustand/authStore";
import { useToast } from "@/components/ui/use-toast";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const BASE_URL = "http://194.146.13.57:3000/v1/admin";

export const submitOnboardingApplication = async (data: any) => {
  const token = useAuthStore.getState().token;
  const { toast } = useToast();

  if (!token) {
    console.error("No token found! User is not authenticated.");
    toast({
      variant: "default",
      duration: 3000,
      title: "Success",
      description: "Application submitted successfully!",
    });
    throw new Error("Unauthorized: No access token provided");
  }

  try {
    const response = await fetch(`${BASE_URL}/schools`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: ` Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to submit application");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
};
