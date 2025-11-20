import { useEffect, useState } from "react";

import { type Class, type Session, type Subject } from "@/types";
import { getClassesForStaff, getSessionsForStaff, getSubjectsForStaff } from "@/utils/api";

export const useExamData = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel using staff endpoints
        const [classesResponse, subjectsResponse, sessionsResponse] = await Promise.all([
          getClassesForStaff("1", "100"), // Get all classes (100 limit)
          getSubjectsForStaff(1, ""), // Get all subjects
          getSessionsForStaff("1", "100"), // Get all sessions
        ]);

        console.log(subjectsResponse?.data);
        // Set the data directly - the API functions now return the correct structure
        setClasses(classesResponse?.data?.result ?? []);
        setSubjects(subjectsResponse?.data ?? []);
        setSessions(sessionsResponse?.data?.result ?? []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch exam data");
        console.error("Error fetching exam data:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchExamData();
  }, []);

  return { classes, subjects, sessions, loading, error };
};
