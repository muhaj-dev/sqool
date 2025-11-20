import { Paperclip } from "lucide-react";
import React, { type ChangeEvent, useRef } from "react";

import { Input } from "./ui/input";

interface AttachmentUploadProps {
  value?: File;
  onChange: (file: File | undefined) => void;
  accept?: string;
}

const AttachmentUpload: React.FC<AttachmentUploadProps> = ({
  value,
  onChange,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onChange(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      className="bg-[#F8F8FD] p-2 flex items-center justify-center rounded-md shadow-sm border-dashed border-2 border-primary cursor-pointer"
    >
      {value ? (
        <div className="flex items-center justify-center gap-4">
          <Paperclip className="text-primary mb-2" />
          <p className="text-gray-500">{value.name}</p>
        </div>
      ) : (
        <div className="flex justify-center gap-4 items-center">
          <Paperclip className="text-primary mb-2" />
          <p className="text-sm text-gray-500">Attach a document</p>
        </div>
      )}

      <Input
        type="file"
        ref={inputRef}
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AttachmentUpload;
