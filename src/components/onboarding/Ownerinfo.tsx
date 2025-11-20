"use client";
import { useOnboarding } from "@/contexts/onboarding-context";

import OwnerInfoForm from "./OwnerInfoForm";

const Ownerinfo = () => {
  const { formData, goPrevPage } = useOnboarding();

  return (
    <div className="py-4">
      <div>
        <h3>Tell us about the School Owner</h3>
        <p className="text-muted-foreground">
          This is Business Owner information that you can update anytime.
        </p>
      </div>
      <div>
        <OwnerInfoForm initialData={formData.OwnerInformation} onPrev={goPrevPage} />
      </div>
    </div>
  );
};

export default Ownerinfo;
