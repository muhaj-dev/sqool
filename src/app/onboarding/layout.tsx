import OnboardingContextProvider from "@/contexts/onboarding-context"
import React, { ReactNode } from "react"

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <section>
      <OnboardingContextProvider>{children}</OnboardingContextProvider>
    </section>
  );
};

export default layout
