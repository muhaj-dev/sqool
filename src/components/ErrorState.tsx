"use client";

import { AlertTriangle } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  error: string | Error;
  onRetry: () => void;
  title?: string;
  description?: string;
  variant?: "full" | "compact";
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  title = "Something went wrong",
  description = "An unexpected issue occurred. Please try again.",
  variant = "full",
  className,
}) => {
  const message = typeof error === "string" ? error : error?.message;

  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center transition-all",
        isCompact
          ? "p-3 space-y-2 rounded-lg border border-border bg-muted/20"
          : "h-[50vh] min-h-[300px] px-6 py-10 space-y-3",
        className,
      )}
    >
      <AlertTriangle
        className={cn("text-red-500", isCompact ? "h-6 w-6 mb-1" : "h-14 w-14 mb-4")}
      />

      {!isCompact && <h2 className="text-2xl font-semibold mb-1">{title}</h2>}

      {!isCompact && <p className="text-muted-foreground text-sm max-w-md">{description}</p>}

      {message ? (
        <p
          className={cn(
            "text-sm text-red-600 bg-red-100 border border-red-200 rounded-md",
            isCompact ? "px-2 py-1" : "px-3 py-2 max-w-md mb-2",
          )}
        >
          {message}
        </p>
      ) : null}

      <Button
        variant={isCompact ? "outline" : "default"}
        size={isCompact ? "sm" : "default"}
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
};

export default ErrorState;
