"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Home() {
  // const navigation = useRouter()
  // useEffect(() => {
  //   // navigation.push("/signin")
  // }, [navigation])
  return (
  <div className="flex items-center justify-center h-screen">
    <div className="h-[100px] flex flex-col items-center ">
      <p className="text-primaryColor text-5xl">Coming Soon...</p>
      <Link href={'/signin'}
      className="bg-primaryColor text-white px-12 mt-24 py-5 rounded-lg"
      >
      Sign in to to have access
      </Link>

    </div>
  </div>
  )
}
