"use client"
import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import Image, { StaticImageData } from "next/image"
import AttachmentUpload from "../AttachmentUpload"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
type TProps = {
  photo: StaticImageData
  fullname: string
  email: string
  subject: string
  total: number
  approved: boolean
}
const ExamCard = ({
  photo,
  fullname,
  email,
  total,
  subject,
  approved,
}: TProps) => {
  return (
    <Card className="py-4 px-3">
      <div className="flex justify-between mb-4 ">
        <div className="flex gap-2">
          <Image
            src={photo}
            alt=""
            className="h-[40px] w-[40px] rounded-full"
          />
          <div>
            <CardTitle className="text-[16px]">{fullname}</CardTitle>
            <CardDescription className="w-[150px] text-sm break-words">
              {" "}
              {email}
            </CardDescription>
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

          <AttachmentUpload />
        </div>
      </CardContent>
    {!approved && 
    <>
    <Separator className="my-2" />
    <CardFooter className="p-0">
      <Button
        className={`w-full text-white ${
          approved ? "bg-green-600 hover:bg-green-500" : "bg-primaryColor"
        }`}
      >
        {approved ? " Approved" : " Approve"}
      </Button>
    </CardFooter>
    </>
    }
    </Card>
  )
}

export default ExamCard
