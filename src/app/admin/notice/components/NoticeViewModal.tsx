"use client";

import { format } from "date-fns";
import { X } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { type Notice } from "@/types";

interface NoticeViewModalProps {
  notice: Notice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NoticeViewModal({ notice, open, onOpenChange }: NoticeViewModalProps) {
  if (!notice) return null;

  const safeFormat = (dateInput: string | Date | undefined | null) => {
    if (!dateInput) return "N/A";
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return "N/A";
    return format(d, "MMM dd, yyyy 'at' hh:mm a");
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "parent":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "staff":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      case "everyone":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      default:
        return "";
    }
  };

  const FileIcon = () => (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.2145 26.25H11.25C8.89298 26.25 7.71447 26.25 6.98223 25.5178C6.25 24.7855 6.25 23.607 6.25 21.25V8.75C6.25 6.39298 6.25 5.21447 6.98223 4.48223C7.71447 3.75 8.89298 3.75 11.25 3.75H18.75C21.107 3.75 22.2855 3.75 23.0178 4.48223C23.75 5.21447 23.75 6.39298 23.75 8.75V17.7145C23.75 18.2254 23.75 18.4809 23.6548 18.7106C23.5597 18.9403 23.3791 19.1209 23.0178 19.4822L16.9822 25.5178C16.6209 25.8791 16.4403 26.0597 16.2106 26.1548C15.9809 26.25 15.7254 26.25 15.2145 26.25Z"
        stroke="#9530AE"
      />
      <path
        d="M15 26.25V20.4167C15 19.0417 15 18.3543 15.4271 17.9271C15.8543 17.5 16.5417 17.5 17.9167 17.5H23.75"
        stroke="#9530AE"
      />
    </svg>
  );

  const DotsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_1069_26036)">
        <path
          d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
          stroke="#181336"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
          stroke="#181336"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
          stroke="#181336"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1069_26036">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="lg:max-w-[40%] w-full max-h-[90vh] overflow-y-auto">
        <DialogClose className="p-1 bg-white rounded-full absolute right-4 top-4 z-10">
          <X className="text-primary h-5 w-5" />
        </DialogClose>

        <div className="pt-6">
          <div className="flex gap-3">
            <div className="bg-[#E5CFFF] basis-[50px] h-fit py-2.5 px-3.5 rounded-md">
              <FileIcon />
            </div>
            <div className="basis-full">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-bold text-lg">{notice.title}</h2>
                <Badge className={getVisibilityColor(notice.visibility)}>{notice.visibility}</Badge>
                {new Date(notice.expirationDate) < new Date() && (
                  <Badge variant="destructive">Expired</Badge>
                )}
              </div>
              <div className="flex text-sm justify-between flex-wrap">
                <div className="mt-1 md:mt-2 pb-1 md:pb-2">
                  <p className="text-muted-foreground">
                    <strong>Summary:</strong> {notice.content}
                  </p>
                </div>
                <div className="text-[#A7A9AD] text-sm flex justify-between gap-2 items-center">
                  <span>Created: {safeFormat(notice.notificationDate)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 mt-4 text-sm">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Full Details:</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {notice.body || notice.content}
              </p>
            </div>

            <div className="border-b-[1px] border-[#A7A9AD] pb-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Notification Date:</p>
                  <p className="text-muted-foreground">{safeFormat(notice.notificationDate)}</p>
                </div>
                <div>
                  <p className="font-medium">Expiration Date:</p>
                  <p className="text-muted-foreground">{safeFormat(notice.expirationDate)}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex-1">
                {notice.resources.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Attachments:</p>
                    <div className="flex flex-col gap-2">
                      {notice.resources.map((resource, index) => (
                        <Link
                          key={index}
                          href={resource}
                          className="text-blue-400 underline hover:text-blue-600 text-sm flex items-center gap-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📎 Resource {index + 1}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <DotsIcon />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
