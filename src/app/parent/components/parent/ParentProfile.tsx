import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const kidsList = [
  {
    id: "AM21-01",
    name: "Jessie Rose",
    admissionDate: "30.11.2023",
    gender: "Female",
    class: 5,
    section: "A",
    rating: 4.0,
    image: "kid1.jpg",
  },
  {
    id: "AM21-02",
    name: "Sammy White",
    admissionDate: "01.12.2023",
    gender: "Male",
    class: 6,
    section: "B",
    rating: 4.2,
    image: "kid2.jpg",
  },
  {
    id: "AM21-03",
    name: "Alice Brown",
    admissionDate: "29.11.2023",
    gender: "Female",
    class: 5,
    section: "A",
    rating: 4.1,
    image: "kid3.jpg",
  },
  {
    id: "AM21-04",
    name: "Johnny Depp",
    admissionDate: "28.11.2023",
    gender: "Male",
    class: 5,
    section: "C",
    rating: 4.3,
    image: "kid4.jpg",
  },
  {
    id: "AM21-05",
    name: "Lily Adams",
    admissionDate: "27.11.2023",
    gender: "Female",
    class: 6,
    section: "B",
    rating: 4.4,
    image: "kid5.jpg",
  },
  {
    id: "AM21-06",
    name: "Michael Green",
    admissionDate: "26.11.2023",
    gender: "Male",
    class: 6,
    section: "C",
    rating: 4.5,
    image: "kid6.jpg",
  },
];

const ParentProfile = () => {
  const navigation = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [kidsPerPage, setKidsPerPage] = useState(2);

  // Calculate total pages based on kidsPerPage
  const totalPages = Math.ceil(kidsList.length / kidsPerPage);

  // Calculate the displayed kids based on the current page
  const indexOfLastKid = currentPage * kidsPerPage;
  const indexOfFirstKid = indexOfLastKid - kidsPerPage;
  const currentKids = kidsList.slice(indexOfFirstKid, indexOfLastKid);

  // Change page
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle number of kids to display
  const handleKidsPerPageChange = (e: { target: { value: any } }) => {
    setKidsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to page 1 whenever the number of kids changes
  };

  // Create pagination range dynamically
  const paginationRange = () => {
    const start = Math.max(currentPage - 1, 1);
    const end = Math.min(currentPage + 1, totalPages);

    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="py-6 px-4 border-2 border-[#F8F8FD]">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4 lg:gap-10">
        {currentKids.map((kid) => (
          <div
            key={kid.id}
            className="cursor-pointer border-2 border-none  flex flex-col gap-4"
            onClick={() => navigation.push(`/parent/${kid.id}`)}
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={kid.image} />
                <AvatarFallback>JB</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center items-baseline">
                <p className="text-lg min-[850px]:text-xl font-semibold">{kid.name}</p>
                <p>ID: {kid.id}</p>
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400" size={20} />
                  <span className="text-[18px]">{kid.rating}</span>
                </div>
              </div>
            </div>
            <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2 ">
              <div className="flex justify-between text-sm gap-2">
                <p className="text-muted-foreground">Admission Date</p>
                <p className="text-muted-foreground">{kid.admissionDate}:</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Gender</p>
                <span className="bg-[#5542F61A] px-2 py-1 rounded-sm text-[#5542F6]">
                  {kid.gender}
                </span>
              </div>
            </div>
            <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Class</p>
                <p className="">{kid.class}</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Section</p>
                <p className="">{kid.section}</p>
              </div>
            </div>
            <Separator />

            <button className="bg-yellow-500 text-white py-2 px-4 mt-4 rounded-md">
              View Results
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        {/* Select number of kids to show per page */}
        <div>
          <label htmlFor="kidsPerPage" className="mr-2">
            View
          </label>
          <select
            id="kidsPerPage"
            value={kidsPerPage}
            onChange={handleKidsPerPageChange}
            className="border border-[#F8F8FD] rounded px-2 py-1"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={6}>6</option>
            <option value={8}>8</option>
          </select>
        </div>

        {/* Pagination buttons with dynamic range */}
        <div className="flex items-center gap-2">
          <button
            className={`px-4 py-2 ${currentPage === 1 ? "text-gray-400" : "text-black"}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <LeftIcon />
          </button>
          {paginationRange().map((page) => (
            <button
              key={page}
              className={`px-4 py-2 border rounded-md ${currentPage === page ? "bg-black text-white" : "text-black"}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className={`px-4 py-2 ${currentPage === totalPages ? "text-gray-400" : "text-black"}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Righticon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;

const Righticon = () => (
  <svg width="4" height="6" viewBox="0 0 4 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.582031 0.5L3.08203 3L0.582031 5.5"
      stroke="#25324B"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LeftIcon = () => (
  <svg width="4" height="6" viewBox="0 0 4 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.08203 0.5L0.582031 3L3.08203 5.5"
      stroke="#25324B"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
