// components/class-management/utils.ts

import { Class, Subject } from "./types";

export const basicClasses = [
  "Nursery 1",
  "Nursery 2",
  "Nursery 3",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JSS 1",
  "JSS 2",
  "JSS 3",
];

export const secondaryClasses = ["SS 1", "SS 2", "SS 3"];

export const secondaryStreams = [
  { value: "science", label: "Science" },
  { value: "arts", label: "Arts" },
  { value: "commerce", label: "Commerce" },
];

export const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const resourceTypes = [
  { value: "syllabus", label: "Syllabus" },
  { value: "assignment", label: "Assignment" },
  { value: "reading", label: "Reading Material" },
  { value: "video", label: "Video Content" },
  { value: "other", label: "Other" },
];

export const getAvailableSubjectsForClass = (
  classLevel: string,
  availableSubjects: Subject[],
  classStream?: string
) => {
  return availableSubjects.filter((subject) => {
    if (subject.level !== classLevel) return false;
    if (classLevel === "secondary" && classStream) {
      return subject.streams.includes(classStream);
    }
    return true;
  });
};

export const filterClasses = (classes: Class[], searchTerm: string) => {
  return classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
};