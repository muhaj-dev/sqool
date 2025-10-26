
import StudentPageClient from "./StudentPageClient";

interface PageParams {
  studentId: string;
}

const Page = async ({
  params,
}: {
  params: Promise<PageParams>;
}) => {
  const { studentId } = await params;

  return <StudentPageClient studentId={studentId} />;
};

export default Page;