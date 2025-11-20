"use client";

import { AlertTriangle, Info, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "./ui/spinner";

/**
 * Reusable Message Dialog
 * - Supports error, warning, info
 * - Bold emphasized message
 * - For critical errors, warning notices, or general system messages
 */

export type MessageDialogType = "error" | "warning" | "info";

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type?: MessageDialogType;
  title?: string;
  message: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  showSpinner?: boolean;
}

const iconMap = {
  error: <XCircle className="w-6 h-6 text-red-600" />,
  warning: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
  info: <Info className="w-6 h-6 text-blue-600" />,
};

export default function MessageDialog({
  open,
  onOpenChange,
  type = "warning",
  title,
  message,
  description,
  actionLabel = "Okay",
  onAction,
  showSpinner = false,
}: MessageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center gap-3">
          {iconMap[type]}
          <div>
            <DialogTitle>{title || type.toUpperCase()}</DialogTitle>
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[40vh] mt-4 pr-3">
          <p className="text-sm leading-relaxed">
            <strong className="font-semibold">{message}</strong>
          </p>
        </ScrollArea>

        {showSpinner ? <Spinner className="flex self-center mx-auto" /> : null}
        <DialogFooter className="mt-4">
          <Button
            variant={type === "error" ? "destructive" : "default"}
            disabled={showSpinner}
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              onAction && onAction();
              onOpenChange(false);
            }}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
