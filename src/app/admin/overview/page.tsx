import { Suspense } from "react";

import Overview from "@/components/admin/overviews";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Overview />
    </Suspense>
  );
};

export default page;
