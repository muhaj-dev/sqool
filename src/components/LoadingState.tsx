import React from "react";

import { Spinner } from "@/components/ui/spinner";

interface LoadingState {
  title: string;
}
const LoadingState: React.FC<LoadingState> = ({ title }) => {
  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto
  top-0 left-0 right-0 bottom-0
  flex items-center justify-center 
  backdrop-blur-sm bg-black/40
  animate-in fade-in duration-200"
    >
      <div className="bg-background border shadow-xl rounded-2xl p-6 w-[260px] flex flex-col items-center gap-4">
        <Spinner className="w-8 h-8 text-primary animate-spin" />

        <p className="text-sm font-medium text-center text-foreground">
          {title}
        </p>
      </div>
    </div>
  );
};

export default LoadingState;
