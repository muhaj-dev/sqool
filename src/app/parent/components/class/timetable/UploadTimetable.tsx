import React from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UploadProps {
  toggleTexam: () => void;
}

export const UploadTimetable: React.FC<UploadProps> = ({ toggleTexam }) => {
  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center">
        <div className="flex gap-7 items-center">
          <Select>
            <SelectTrigger className="w-[120px] text-[#84818A]">
              <SelectValue placeholder="Type " />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="test">Test</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[120px] text-[#84818A]">
              <SelectValue placeholder="Session" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">1st Session 2024</SelectItem>
              <SelectItem value="dark">2nd Session 2024</SelectItem>
              <SelectItem value="system">3rd Session 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={toggleTexam} className="text-white">
          View Results
        </Button>
      </div>

      <div className=" mx-auto my-4 p-8 max-w-[519px] w-[95%]">
        <h2 className="text-xl font-semibold text-center mx-auto ">Upload</h2>
        <form>
          <div className="my-8 border-dashed border-2 py-8 border-[#515B6F80] rounded-md ">
            <div className="w-fit mx-auto  mb-6">
              <UploadIcon />
            </div>
            <h2 className="text-lg font-semibold text-center mx-auto ">
              Drag & drop files or <span className="text-primary underline">Browse</span>
            </h2>
            <p className="text-center text-[12px] mt-3 text-[#676767]">
              Supported formates: PDF, Word, PPT, XLSX
            </p>
          </div>

          <div className="my-2 space-y-2">
            <h3 className="text-md font-semibold text-[#676767] mx-auto ">Uploading</h3>

            <div className="border-[1.5px] overflow-hidden border-[#E3E3E3] rounded-md">
              <p className="text-[12px] py-2 px-3">1st-term-2024-result.PDF</p>
              <div className="w-[50%] h-1 bg-primary" />
            </div>
          </div>

          <div className="my-2.5 space-y-2">
            <h3 className="text-md font-semibold text-[#676767] mx-auto ">Uploaded</h3>

            <div className="border-[1.5px] overflow-hidden border-[#E3E3E3] rounded-md">
              <p className="text-[12px] py-2 px-3">1st-term-2024-result.PDF</p>
              {/* <div className="w-[50%] h-1 bg-primary" /> */}
            </div>
          </div>

          <Button type="submit" className=" w-full my-5 text-white">
            UPLOAD FILES
          </Button>
        </form>
      </div>
    </div>
  );
};

const UploadIcon = () => {
  return (
    <svg width="70" height="60" viewBox="0 0 70 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M36.6364 14.7458L36.7287 14.7733L36.7327 14.7688C37.1703 14.8481 37.6045 14.586 37.7331 14.1519C38.9047 10.2152 42.5958 7.46504 46.7082 7.46504C47.1951 7.46504 47.59 7.07016 47.59 6.5833C47.59 6.09643 47.1951 5.70156 46.7082 5.70156C41.6541 5.70156 37.4069 9.06665 36.0432 13.6493C35.904 14.1162 36.1699 14.6067 36.6364 14.7458Z"
        fill="#E5B80B"
        stroke="#F9FFF9"
        strokeWidth="0.3"
      />
      <path
        d="M56.9531 42.4384H52.5628C52.1588 42.4384 51.8311 42.1107 51.8311 41.7067C51.8311 41.3027 52.1588 40.9749 52.5628 40.9749H56.9531C63.005 40.9749 67.9291 36.0509 67.9291 29.999C67.9291 23.9471 63.005 19.023 56.9531 19.023H56.8475C56.6354 19.023 56.4336 18.9311 56.2946 18.7706C56.1555 18.6101 56.0928 18.3974 56.1231 18.1873C56.1885 17.7315 56.2214 17.2737 56.2214 16.8279C56.2214 11.5829 51.9538 7.31531 46.7089 7.31531C44.6684 7.31531 42.7225 7.95296 41.0812 9.15978C40.7206 9.42478 40.2084 9.30718 39.9999 8.91047C35.3518 0.0596993 23.2117 -1.12887 16.9176 6.57053C14.2662 9.81417 13.2244 14.0336 14.0592 18.146C14.1512 18.6002 13.8036 19.0236 13.3421 19.0236H13.0489C6.99697 19.0236 2.07291 23.9477 2.07291 29.9996C2.07291 36.0514 6.99697 40.9755 13.0489 40.9755H17.4392C17.8432 40.9755 18.1709 41.3032 18.1709 41.7072C18.1709 42.1113 17.8432 42.439 17.4392 42.439H13.0489C6.18988 42.439 0.609375 36.8585 0.609375 29.9995C0.609375 23.3329 5.88093 17.8742 12.4744 17.5731C11.8551 13.3066 13.0395 9.00295 15.7844 5.64437C22.5231 -2.5996 35.4374 -1.67556 40.8965 7.51707C42.6381 6.42522 44.6309 5.85244 46.7086 5.85244C53.0632 5.85244 58.0985 11.261 57.6579 17.58C64.1907 17.9463 69.3923 23.3763 69.3923 29.999C69.3923 36.8585 63.8118 42.4384 56.9528 42.4384L56.9531 42.4384Z"
        fill="#E5B80B"
      />
      <path
        d="M16.4594 41.2935C16.4594 51.4634 24.733 59.737 34.9029 59.737C45.0728 59.737 53.3463 51.4633 53.3463 41.2935C53.3463 31.1235 45.0728 22.85 34.9029 22.85C24.7329 22.85 16.4594 31.1237 16.4594 41.2935ZM18.2232 41.2935C18.2232 32.0966 25.7058 24.6138 34.9029 24.6138C44.0998 24.6138 51.5825 32.0964 51.5825 41.2935C51.5825 50.4904 44.0998 57.9732 34.9029 57.9732C25.706 57.9732 18.2232 50.4905 18.2232 41.2935Z"
        fill="#E5B80B"
        stroke="#F9FFF9"
        strokeWidth="0.3"
      />
      <path
        d="M34.5531 48.6577C34.5531 49.0363 34.8602 49.3434 35.2388 49.3434C35.6174 49.3434 35.9245 49.0367 35.9245 48.6577V34.7291C35.9245 34.3504 35.6175 34.0434 35.2388 34.0434C34.8602 34.0434 34.5531 34.3504 34.5531 34.7291V48.6577Z"
        fill="#E5B80B"
        stroke="white"
        strokeWidth="0.3"
      />
      <path
        d="M35.2375 35.7001L31.4368 39.5008L35.2375 35.7001ZM35.2375 35.7001L39.0383 39.5009C39.172 39.6346 39.348 39.7017 39.5231 39.7017L35.2375 35.7001ZM30.4669 39.5009C30.7347 39.7687 31.1691 39.7689 31.4367 39.5009L39.5231 39.7017C39.698 39.7017 39.8741 39.6352 40.008 39.5009C40.2759 39.233 40.2759 38.799 40.008 38.5311L35.7223 34.2455C35.4545 33.9777 35.0202 33.9775 34.7526 34.2455C34.7525 34.2455 34.7525 34.2456 34.7525 34.2456L30.4669 38.5311C30.199 38.799 30.199 39.233 30.4669 39.5009Z"
        fill="#E5B80B"
        stroke="white"
        strokeWidth="0.3"
      />
    </svg>
  );
};
