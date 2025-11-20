"use client";

import { useRouter } from "next/navigation";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import { useToast } from "@/components/ui/use-toast";
import {
  type OwnerInformation,
  type SchoolInformation,
  type SchoolSetup,
} from "@/types/onboarding";
import { createSchool } from "@/utils/api";

interface OnboardingStep {
  label: string;
  text: string;
  isCompleted: boolean;
}

interface FormData {
  SchoolInformation: SchoolInformation;
  OwnerInformation: OwnerInformation[];
  SchoolSetup: SchoolSetup;
  UploadedFiles: File[];
}

interface IOnboardingContext {
  updateCompletionState: (item: string) => void;
  submitApplication: () => Promise<void>;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  goNextPage: () => void;
  goPrevPage: () => void;
  onboarding: OnboardingStep[];
  activeIndex: number;
  formData: FormData;
  updateFormData: (section: keyof FormData, data: any) => void; // Temporary any, will refine below
  updateUploadedFiles: (files: File[]) => void;
  resetFormData: () => void;
}

const defaultFormData: FormData = {
  SchoolInformation: {
    name: "",
    description: "",
    schoolType: "",
    address: {
      schoolAddress: "",
      localGovernment: "",
      state: "",
    },
  },
  OwnerInformation: [],
  SchoolSetup: {
    foundingDate: "",
    schoolShortName: "",
    schoolMotto: "",
    studentGender: "Mixed",
    schoolPhoneNumber: "",
    schoolEmailAddress: "",
    schoolAddress: "",
    country: "",
    lga: "",
    state: "",
    schoolWebsite: "",
  },
  UploadedFiles: [],
};

const defaultOnboardingSteps: OnboardingStep[] = [
  {
    label: "School Information",
    text: "Information of the school",
    isCompleted: false,
  },
  {
    label: "Owner Information",
    text: "Personal information of the business Owner(s)",
    isCompleted: false,
  },
  {
    label: "Business Documentation",
    text: "Information of the business",
    isCompleted: false,
  },
  {
    label: "Setup School",
    text: "Information about the school setup",
    isCompleted: false,
  },
];

export const OnboardingContext = createContext<IOnboardingContext>({
  updateCompletionState: () => {},
  submitApplication: async () => {},
  onboarding: defaultOnboardingSteps,
  goNextPage: () => {},
  goPrevPage: () => {},
  activeIndex: 0,
  setActiveIndex: () => {},
  formData: defaultFormData,
  updateFormData: () => {},
  updateUploadedFiles: () => {},
  resetFormData: () => {},
});

const OnboardingContextProvider = ({ children }: { children: ReactNode }) => {
  const navigation = useRouter();
  const { toast } = useToast();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [onboarding, setOnboarding] = useState<OnboardingStep[]>(defaultOnboardingSteps);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const updateCompletionState = (item: string) => {
    setOnboarding((prev) =>
      prev.map((val) => (val.label === item ? { ...val, isCompleted: true } : val)),
    );
  };

  const goNextPage = () => {
    toast({
      variant: "default",
      duration: 3000,
      title: "Success",
      description: "Item saved successfully!",
    });
    setActiveIndex((prev) => prev + 1);
  };

  const goPrevPage = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  // Refined updateFormData with proper type constraints
  const updateFormData = <K extends keyof FormData>(
    section: K,
    data:
      | Partial<FormData[K]>
      | (K extends "OwnerInformation" ? OwnerInformation[] : never)
      | (K extends "UploadedFiles" ? File[] : never),
  ) => {
    setFormData((prev) => {
      if (section === "OwnerInformation" && Array.isArray(data)) {
        return {
          ...prev,
          OwnerInformation: data as OwnerInformation[],
        };
      }
      if (section === "UploadedFiles" && Array.isArray(data)) {
        return {
          ...prev,
          UploadedFiles: [...prev.UploadedFiles, ...(data as File[])],
        };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          ...(data as Partial<FormData[K]>),
        },
      };
    });
  };

  const updateUploadedFiles = (files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      UploadedFiles: [...prev.UploadedFiles, ...files], // Append files
    }));
  };

  const resetFormData = () => {
    setFormData(defaultFormData);
    setOnboarding(defaultOnboardingSteps);
    setActiveIndex(0);
  };

  const submitApplication = async () => {
    console.log(formData.SchoolSetup.schoolShortName);
    try {
      // Define the API-expected file names in order
      const apiExpectedNames = ["schoolId", "cacId", "utility"];

      // Rename files while preserving their original extensions
      const renamedFiles = formData.UploadedFiles.map((file, index) => {
        const originalExtension = file.name.split(".").pop() || "";
        const newName = apiExpectedNames[index]
          ? `${apiExpectedNames[index]}.${originalExtension}`
          : file.name;
        return new File([file], newName, { type: file.type });
      });

      // Prepare the request body with corrected property names
      const requestBody = {
        name: formData.SchoolInformation.name,
        plan: "Basic Plan",
        country: "Nigeria",
        type: "medium",
        size: 1,
        schoolInformation: {
          description: formData.SchoolInformation.description,
          name: formData.SchoolInformation.name,
          schoolType: formData.SchoolInformation.schoolType,
          address: {
            schoolAddress: formData.SchoolInformation.address.schoolAddress,
            // Changed from LocalGovernment to localGovernment
            localGovernment: formData.SchoolInformation.address.localGovernment,
            state: formData.SchoolInformation.address.state,
          },
        },
        ownerInformation: (Array.isArray(formData.OwnerInformation)
          ? formData.OwnerInformation
          : formData.OwnerInformation
            ? [formData.OwnerInformation]
            : []
        )
          // Remove unexpected dob property if it exists
          .map((owner) => {
            const { dob, ...rest } = owner;
            return rest;
          }),
        schoolSetup: {
          foundingDate: formData.SchoolSetup.foundingDate,
          // Changed from schoolBlockName to schoolShortName
          schoolShortName: formData.SchoolSetup.schoolShortName,
          schoolMotto: formData.SchoolSetup.schoolMotto,
          studentGender: formData.SchoolSetup.studentGender || "Mixed",
          schoolPhoneNumber: formData.SchoolSetup.schoolPhoneNumber,
          schoolEmailAddress: formData.SchoolSetup.schoolEmailAddress,
          schoolAddress: formData.SchoolSetup.schoolAddress,
          lga: formData.SchoolSetup.lga,
          // Removed state as it shouldn't exist according to error
          country: formData.SchoolSetup.country || "Nigeria", // Added country
          schoolWebsite: formData.SchoolSetup.schoolWebsite
            ? formData.SchoolSetup.schoolWebsite.startsWith("http")
              ? formData.SchoolSetup.schoolWebsite
              : `https://${formData.SchoolSetup.schoolWebsite}`
            : "",
        },
      };

      // Validate required fields
      if (!requestBody.name) throw new Error("School name is required");
      if (!requestBody.ownerInformation.length) throw new Error("Owner information is required");
      if (!requestBody.schoolSetup.schoolShortName)
        throw new Error("School short name is required");
      if (!requestBody.schoolSetup.country) throw new Error("Country is required");
      if (!requestBody.schoolSetup.schoolWebsite) throw new Error("School website is required");

      // Create FormData for the request
      const formDataToSend = new FormData();

      // Append each field with proper type conversion
      Object.entries(requestBody).forEach(([key, value]) => {
        if (typeof value === "object") {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (typeof value === "number") {
          formDataToSend.append(key, value.toString());
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Append renamed files
      renamedFiles.forEach((file) => {
        formDataToSend.append("uploadedFiles", file);
      });

      console.log("Submitting:", requestBody);

      const response = await createSchool(formDataToSend);
      //@ts-expect-error message
      if (response.status >= 200 && response.status < 300) {
        toast({
          variant: "default",
          duration: 3000,
          title: "Success",
          description: "School created successfully!",
        });
        navigation.push("/admin/compulsory");
        resetFormData();
        return response.data;
      } else {
        toast({
          variant: "destructive",
          duration: 3000,
          title: "Error",
          //@ts-expect-error message
          description: response.data.message || "Failed to create school",
        });
        //@ts-expect-error message
        throw new Error(response.data.message || "Failed to create school");
      }
    } catch (error) {
      let errorMessage = "Failed to submit application";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        duration: 3000,
        title: "Error",
        description: errorMessage,
      });
      throw error;
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        updateCompletionState,
        //@ts-expect-error message
        submitApplication,
        onboarding,
        goNextPage,
        goPrevPage,
        activeIndex,
        setActiveIndex,
        formData,
        updateFormData,
        updateUploadedFiles,
        resetFormData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);

export default OnboardingContextProvider;
