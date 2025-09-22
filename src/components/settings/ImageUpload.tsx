"use client"
import React, { useRef, useState, ChangeEvent } from "react"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [url, setUrl] = useState<string | null>("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const url = URL.createObjectURL(files[0])
      setSelectedImage(files[0])
      setUrl(url)
    }
  }
  const clickHandler = () => {
    inputRef.current?.focus()
  }
  const handleFileRemove = () => {
    setSelectedImage(null)
    URL.revokeObjectURL(url!)
    setUrl(null)
    inputRef.current?.focus()
  }
  return (
    <div className="flex item-center gap-4 w-full">
      <div className="flex flex-col items-center ">
        <Avatar className="">
          <AvatarImage src={selectedImage ? url! : ""} alt="@shadcn" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Input
          type="file"
          accept="imge/png, image/jpg"
          className="hidden"
          ref={inputRef}
          onChange={handleImageUpload}
        />
        {!url ? (
          <span
            onClick={clickHandler}
            className="text-primaryColor cursor-pointer "
          >
            Add Photo
          </span>
        ) : (
          <span
            onClick={handleFileRemove}
            className="text-primaryColor cursor-pointer "
          >
            Change Photo
          </span>
        )}
      </div>
      <span className=" w-[70%]    text-[#515B6F]">
        we only accept this type of format (PNG, JPG). kindly upload photo not
        more that 5mb
      </span>
    </div>
  )
}

export default ImageUpload
