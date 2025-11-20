import { type ReactNode } from "react";

import OnboardingContextProvider from "@/contexts/onboarding-context";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <section>
      <OnboardingContextProvider>{children}</OnboardingContextProvider>
    </section>
  );
};

export default layout;
