import Link from "next/link";

import ConfigurationForm from "@/components/admin/compulsory/ConfigurationForm";

interface PageProps {
  searchParams?: Promise<{ type?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const type = params?.type || "";

  return (
    <div>
      <Link href="/admin/compulsory" className="border py-3 px-6 rounded-md text-primary">
        Back
      </Link>
      <ConfigurationForm classType={type} />
    </div>
  );
};

export default Page;
