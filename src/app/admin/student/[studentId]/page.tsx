

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
import StudentPageClient from "./StudentPageClient";


export default async function StudentPage({ 
  params, 
}: 
{params: Promise<{studentId: string}>;
}) {
  const studentId = (await params).studentId;
  // if (!studentId) return notFound(); // Handle 404 gracefully
  return (
   
        <div>
      <p>{studentId}</p>
       <StudentPageClient studentId={studentId} />
    </div>
  );
}