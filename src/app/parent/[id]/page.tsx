"use client";

import KidsBar from "../components/parent/KidBar";
import KidsDetails from "../components/parent/KidDetails";

const Page = () => {
  return (
    <div>
      <KidsBar />
      <div className="w-full mt-8 bg-white py-5 px-0 md:px-9">
        <KidsDetails />
      </div>
    </div>
  );
};

export default Page;
