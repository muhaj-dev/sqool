"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Kid {
  id: number;
  name: string;
  imgSrc: string;
}

const kidsList: Kid[] = [
  { id: 1, name: "Jessie Rose", imgSrc: "/images/kid1.jpg" },
  { id: 2, name: "Sam Johnson", imgSrc: "/images/kid2.jpg" },
  { id: 3, name: "Ella Watson", imgSrc: "/images/kid3.jpg" },
];

const KidsDropdown = () => {
  const [selectedKid, setSelectedKid] = useState<Kid>(kidsList[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectKid = (kid: Kid) => {
    setSelectedKid(kid);
    setIsOpen(false);
  };

  return (
    <div className="relative w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-2 border border-[#E4E4E4] rounded-lg"
      >
        <div className="flex items-center gap-3">
          <Avatar className="">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="text-start text-sm md:text-[1rem]">
            <p className="font-5000 ">Kid {selectedKid.id}</p>
            <p className="text-sm text-[#A6A6A6]">{selectedKid.name}</p>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {/* Dropdown List */}
      {isOpen ? (
        <ul className="absolute w-full mt-2 bg-white border border-[#E4E4E4] rounded-lg shadow-lg">
          {kidsList.map((kid) => (
            <li
              key={kid.id}
              onClick={() => handleSelectKid(kid)}
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100"
            >
              <Avatar className="">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-500">Kid {kid.id}</p>
                <p className="text-sm text-[#A6A6A6]">{kid.name}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default KidsDropdown;
