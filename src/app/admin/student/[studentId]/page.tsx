

// interface PageParams {
//   studentId: string;
// }

// const Page = async ({
//   params,
// }: {
//   params: Promise<PageParams>;
// }) => {
//   const { studentId } = await params;

//   return <StudentPageClient studentId={studentId} />;
// };

// export default Page;

// 'use client'

// import { use } from 'react'
// import StudentPageClient from "./StudentPageClient";
 
// export default function StudentPage({
//   params,
// }: {
//   params: Promise<{ studentId: string }>
// }) {
//   const { studentId } = use(params)
 
//   return (
//     <div>
//       <p>{studentId}</p>
//        <StudentPageClient studentId={studentId} />
//     </div>
//   )
// }


// import { notFound } from "next/navigation";
// import StudentPageClient from "./StudentPageClient";


// export default async function Page({
//   params,
// }: {
//   params: Promise<{ studentId: string }>
// }) {
//   const { studentId } = await params
//   // if (!studentId) return notFound(); // Handle 404 gracefully
//   return (

//     <div className="w-full bg-white  px-0 md:px-4">
//         {/* <StudentLeftBar /> */}
//         <div className="bg-white flex-1 rounded-md">
// <p>{studentId}</p>
//           {/* <StudentSteps /> */}
// <StudentPageClient studentId={studentId} />
//           {/* {children} */}
//         </div>
//       </div>
//   );
// }

import StudentPageClient from "./StudentPageClient";

export default async function Page({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  try {
    const { studentId } = await params;
    
    // Validate studentId
    if (!studentId || studentId.trim() === '') {
      throw new Error('Invalid studentId');
    }

    return (
      <div className="w-full bg-white px-0 md:px-4">
        {/* <p>Student ID: {studentId}</p> */}
        <StudentPageClient studentId={studentId} />
      </div>
    );
  } catch (error) {
    console.error('Error in dynamic route:', error);
    throw error; // This will trigger your error boundary
  }
}