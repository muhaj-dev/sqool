import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

const Wrapper = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={cn("flex flex-col justify-center items-center w-full h-full ", className)}>
      {children}
    </div>
  );
};

export default Wrapper;
