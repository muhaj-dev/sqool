"use client";
import Image, { type StaticImageData } from "next/image";

import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface TProps {
  photo: StaticImageData;
  fullname: string;
  email: string;
  subject: string;
  total: number;
  approved: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onSchedule?: () => void;
  loading?: boolean;
  status?: string;
}

const ExamCard = ({
  photo,
  fullname,
  email,
  total,
  subject,
  approved,
  onApprove,
  onReject,
  onSchedule,
  loading,
  status,
}: TProps) => {
  return (
    <Card className="py-4 px-3 my-3">
      <div className="flex justify-between mb-4 ">
        <div className="flex gap-2">
          <Image src={photo} alt="" className="h-[40px] w-[40px] rounded-full" />
          <div>
            <CardTitle className="text-[16px]">{fullname}</CardTitle>
            <CardDescription className="w-[150px] text-sm break-words">{email}</CardDescription>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm">Total student</p>
          <p className="text-xl font-semibold">{total}</p>
        </div>
      </div>
      <CardContent className="w-full p-0 my-4">
        <div className="flex gap-1 items-center mb-2">
          <span className="text-muted-foreground">Subject:</span>
          <span>{subject}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Attach Exam Question</span>
          {/* <AttachmentUpload /> */}
        </div>
      </CardContent>
      {status === "pending" && (
        <>
          <Separator className="my-2" />
          <CardFooter className="p-0 gap-3">
            <Button className="w-full text-white bg-primary" onClick={onApprove} disabled={loading}>
              {loading ? "Approving..." : "Approve"}
            </Button>
            <Button className="w-full text-white bg-red-600" onClick={onReject} disabled={loading}>
              {loading ? "Rejecting..." : "Reject"}
            </Button>
            <Button
              className="w-full text-white bg-yellow-600"
              onClick={onSchedule}
              disabled={loading}
            >
              {loading ? "Scheduling..." : "Schedule"}
            </Button>
          </CardFooter>
        </>
      )}
      {approved ? (
        <>
          <Separator className="my-2" />
          <CardFooter className="p-0 gap-3">
            {/* {status === "approve" && (
          <>
            <Button
              className="w-full text-white bg-primary"
              onClick={onApprove}
              disabled={loading}
            >
              {loading ? "Approving..." : "Approve"}
            </Button>
            <Button
              className="w-full text-white bg-red-600"
              onClick={onReject}
              disabled={loading}
            >
              {loading ? "Rejecting..." : "Reject"}
            </Button>
            
          </>
        )} */}

            {status === "reject" && (
              <Button className="w-full text-white bg-gray-600" disabled>
                Rejected
              </Button>
            )}
            {status === "scheduled" && (
              <Button
                className="w-full text-white bg-yellow-600"
                onClick={onSchedule}
                disabled={loading}
              >
                {loading ? "Scheduling..." : "Schedule"}
              </Button>
            )}
          </CardFooter>
        </>
      ) : null}
    </Card>
  );
};

export default ExamCard;
