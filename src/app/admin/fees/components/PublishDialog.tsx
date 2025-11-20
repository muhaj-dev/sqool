"use client";

import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type FeeStructure } from "@/types";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feeToPublish: FeeStructure | null;
  publishing: boolean;
  getClassName: (fee: FeeStructure) => string;
  getSessionName: (fee: FeeStructure) => string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PublishDialog({
  open,
  onOpenChange,
  feeToPublish,
  publishing,
  getClassName,
  getSessionName,
  onConfirm,
  onCancel,
}: PublishDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Publish Fee Structure
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to publish this fee structure?
          </DialogDescription>
        </DialogHeader>

        {feeToPublish ? (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Class:</span>
                <span className="text-sm">{getClassName(feeToPublish)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Session:</span>
                <span className="text-sm">{getSessionName(feeToPublish)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Amount:</span>
                <span className="text-sm font-semibold">
                  ₦{feeToPublish.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-primary/20 border border-primary rounded-md p-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 text-primary flex-shrink-0 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm">
                  Once published, this fee structure will be visible to parents and students and
                  cannot be unpublished.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={publishing}>
            Cancel
          </Button>

          <Button
            type="button"
            variant="default"
            onClick={onConfirm}
            disabled={publishing}
            className=""
          >
            {publishing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Publishing...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Publish Fee Structure
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
