"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { LAST_PAGE_VISITED_BEFORE_AUTH } from "@/constants";
import { useAuthStore } from "@/zustand/authStore";

export default function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!user) {
      //TODO: Adjust condition based on auth logic and persist user state in localStorage or cookies
      // Save the current page
      if (typeof window !== "undefined") {
        localStorage.setItem(LAST_PAGE_VISITED_BEFORE_AUTH, pathname);
        clearAuth();
        router.push("/signin");
      }
    }
  }, [user, pathname, router]);
}
