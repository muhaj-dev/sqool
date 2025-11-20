"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type FeeStructure } from "@/types";

interface FeeDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFee: FeeStructure | null;
  getClassName: (fee: FeeStructure) => string;
  getSessionName: (fee: FeeStructure) => string;
}

export function FeeDetailsDialog({
  open,
  onOpenChange,
  selectedFee,
  getClassName,
  getSessionName,
}: FeeDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fee Structure Details</DialogTitle>
          <DialogDescription>
            Complete breakdown of fees for {selectedFee ? getClassName(selectedFee) : null} -{" "}
            {selectedFee ? getSessionName(selectedFee) : null}
          </DialogDescription>
        </DialogHeader>

        {selectedFee ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-semibold">{getClassName(selectedFee)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Session</p>
                <p className="font-semibold">{getSessionName(selectedFee)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-semibold text-lg">₦{selectedFee.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Term Breakdown</h3>
              {selectedFee.terms.map((term: any) => (
                <Card key={term.term}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base capitalize flex items-center justify-between">
                      {term.term} Term
                      <span className="text-lg font-bold">₦{term.amount.toLocaleString()}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object?.entries(term?.breakdown || []).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center border-b pb-2 last:border-0"
                        >
                          <span className="text-sm capitalize text-muted-foreground">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="font-medium">₦{(value as number).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
