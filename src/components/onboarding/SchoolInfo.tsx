"use client";
import SchoolInfoForm from "./SchoolInfoForm";
import { useOnboarding } from "@/contexts/onboarding-context";

const SchoolInfo = () => {

  const { formData, goPrevPage } = useOnboarding();

  return (
    <div className="py-4">
      <div>
        <h3>Tell us about your School</h3>
        <p className="text-muted-foreground">
          This is School information that you can update anytime.
        </p>
      </div>
      <div>
        <SchoolInfoForm 
          initialData={formData.SchoolInformation}
          onPrev={goPrevPage}
        />
      </div>
    </div>
  );
};

export default SchoolInfo;