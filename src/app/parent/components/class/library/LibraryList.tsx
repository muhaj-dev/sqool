"use client";

import { libraryData } from "@/components/student/student-data";

import { libraryColumns } from "./libraryColumn";
import { LibraryTable } from "./LibraryTable";

const LibraryList = () => {
  return (
    <section className="flex flex-col gap-4">
      <div className="bg-white p-4 rounded-md">
        <LibraryTable data={libraryData} columns={libraryColumns} />
      </div>
    </section>
  );
};

export default LibraryList;
