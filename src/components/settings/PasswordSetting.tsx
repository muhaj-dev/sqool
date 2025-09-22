"use client"
import React, { useState } from "react"
// import ImageUpload from "./ImageUpload"
import { Separator } from "../ui/separator"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { PinInput } from "react-input-pin-code"

const PasswordSetting = () => {
  const [currentPin, setCurrentPin] = useState(["", "", "", ""])
  const [newPin, setNewPin] = useState(["", "", "", ""])
  return (
    <div className="bg-white rounded-md p-6 flex flex-col gap-4 ">
      <form className="grid grid-cols-1 lg:grid-cols-3 gap-10 py-4 w-full md:w-[90%]">
        <div className="col-span-1 flex flex-col gap-4">
          <p className="font-semibold">Change Password</p>
          <p className="text-muted-foreground ">
            Password must Consist the following
          </p>
          <div className="flex items-center text-muted-foreground gap-2">
            <div className="w-6 h-6 rounded-full bg-primaryColor"></div>
            <p>A minimum of 8 characters</p>
          </div>
          <div className="flex items-center text-muted-foreground gap-2">
            <div className="w-6 h-6 rounded-full bg-primaryColor"></div>
            <p>At least one letter</p>
          </div>
          <div className="flex items-center text-muted-foreground gap-2">
            <div className="w-6 h-6 rounded-full bg-primaryColor"></div>
            <p>At least one number</p>
          </div>
          <div className="flex items-center text-muted-foreground gap-2">
            <div className="w-6 h-6 rounded-full bg-primaryColor"></div>
            <p>At least one special character</p>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-4 ">
          <div className="flex-1">
            <Label>Current Password</Label>
            <Input />
          </div>
          <div className="flex-1">
            <Label>New Password</Label>
            <Input />
          </div>
          <div className="flex-1">
            <Label>Confirm Password</Label>
            <Input />
          </div>
          <Button className="w-full text-white mt-6">Save Change</Button>
        </div>
      </form>
      <Separator />
      <form className="grid  grid-cols-1 lg:grid-cols-3 gap-10 py-4 w-full md:w-[90%]">
        <div className="col-span-1 flex flex-col gap-4">
          <p className="font-semibold">Set Pin</p>
          <p className="text-muted-foreground ">
            Pin must Consist the following
          </p>
          <div className="flex items-center text-muted-foreground gap-2">
            <div className="w-6 h-6 rounded-full bg-primaryColor"></div>
            <p>A minimum of 4 characters</p>
          </div>
          <div className="flex items-center text-muted-foreground gap-2">
            <div className="w-6 h-6 rounded-full bg-primaryColor"></div>
            <p>At least one letter</p>
          </div>

          <div className="flex items-center text-muted-foreground gap-2">
            <div className="w-6 h-6 rounded-full bg-primaryColor"></div>
            <p>At least one special character</p>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-4 ">
          <div className="flex-1 ">
            <Label>New Pin</Label>
            <PinInput
              type="text"
              errorBorderColor="red"
              borderColor="gray"
              validBorderColor="#E5B80B"
              values={currentPin}
              onChange={(value, index, values) => setCurrentPin(values)}
              onComplete={values => {
                console.log(values)
              }}
              containerStyle={{
                justifyContent: "space-between",
                width: "80%",
                marginTop: "1rem",
              }}
            />
          </div>
          <div className="flex-1 ">
            <Label>Confirm Pin</Label>
            <PinInput
              type="text"
              errorBorderColor="red"
              borderColor="gray"
              validBorderColor="#E5B80B"
              values={currentPin}
              onChange={(value, index, values) => setCurrentPin(values)}
              onComplete={values => {
                console.log(values)
              }}
              containerStyle={{
                justifyContent: "space-between",
                width: "80%",
                marginTop: "1rem",
              }}
            />
          </div>

          <Button className="w-full text-white mt-6">Save Change</Button>
        </div>
      </form>
    </div>
  )
}

export default PasswordSetting
