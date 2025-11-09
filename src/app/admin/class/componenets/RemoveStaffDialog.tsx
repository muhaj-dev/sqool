"use client";

import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Item, ItemMedia, ItemContent, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";

interface RemoveStaffDialogProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  staff: {
    teacherId: string;
    userId: {
      firstName: string;
      lastName: string;
    } | null;
    className: string;
    classId: string;
  } | null;
  loading: boolean;
  onConfirm: () => Promise<void>;
}

export function RemoveStaffDialog({
  open,
  setOpen,
  staff,
  loading,
  onConfirm,
}: RemoveStaffDialogProps) {
  if (!staff) return null;
  return (
    <Dialog open={open} onOpenChange={!loading ? setOpen : () => {}}>
      <DialogContent className="overflow-hidden">
        {/* LOADING OVERLAY */}
        {loading && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center 
            bg-black/40 backdrop-blur-sm"
          >
            <Item variant="muted">
              <ItemMedia>
                <Spinner />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-1">
                  Removing staff...
                </ItemTitle>
              </ItemContent>
            </Item>
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-destructive" />
            Remove Staff from {staff.className} Class
          </DialogTitle>
          <DialogDescription>
            This action will remove the staff from this class. They will no
            longer appear as a class tutor or have subject access for this
            class.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="rounded-lg border bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground">Staff</p>
            <p className="font-medium mt-1">
              {staff?.userId?.firstName} {staff?.userId?.lastName}
            </p>

            <p className="text-sm text-muted-foreground mt-3">Class</p>
            <p className="font-medium">{staff?.className}</p>
          </div>

          <div
            className="bg-destructive/10 border border-destructive/30 text-destructive 
            rounded-md p-3 text-sm"
          >
            <p className="leading-relaxed">
              Are you sure you want to remove this staff? This action cannot be
              undone.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => !loading && setOpen(false)}
            disabled={loading}
            className="w-full"
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="w-full"
          >
            Confirm Removal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
