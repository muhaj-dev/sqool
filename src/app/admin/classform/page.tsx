import ConfigurationForm from "@/components/admin/compulsory/ConfigurationForm"
import Link from "next/link"
import React from "react"

interface PageProps {
  searchParams?: Promise<{ type?: string }>
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const type = params?.type || ""

  return (
    <div>
      <Link
        href="/admin/compulsory"
        className="border py-3 px-6 rounded-md text-primaryColor"
      >
        Back
      </Link>
      <ConfigurationForm classType={type} />
    </div>
  )
}

export default Page
