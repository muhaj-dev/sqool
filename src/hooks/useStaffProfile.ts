import { useEffect, useState } from "react";

import { type StaffProfileResponse } from "@/types";
import { getStaffProfile } from "@/utils/api";

export const useStaffProfile = () => {
  const [staffData, setStaffData] = useState<StaffProfileResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaffProfile = async () => {
      try {
        setLoading(true);
        const response = await getStaffProfile();
        setStaffData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch staff profile");
        console.error("Error fetching staff profile:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchStaffProfile();
  }, []);

  return { staffData, loading, error };
};
