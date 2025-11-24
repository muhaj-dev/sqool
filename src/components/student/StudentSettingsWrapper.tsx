// components/student/StudentSettingsWrapper.tsx
import { type ISingleStudent } from "@/types";
import StudentSettings from "./StudentSettings";

// Convert ISingleStudent to the expected StudentData type
const adaptStudentData = (data: ISingleStudent | null) => {
  if (!data) return null;

  // Handle the case where parent might be a string ID instead of an object
  let parentData;
  if (typeof data.parent === "string") {
    // If parent is just a string ID, create a minimal parent object
    parentData = {
      _id: data.parent,
      userId: { firstName: "Unknown", lastName: "Parent" },
      isActive: false,
    };
  } else {
    // If parent is already an object, use it directly
    parentData = data.parent || {
      _id: "",
      userId: { firstName: "", lastName: "" },
      isActive: false,
    };
  }

  // Handle the case where class might be a string ID instead of an object
  let classData;
  if (typeof data.class === "string") {
    // If class is just a string ID, create a minimal class object
    classData = {
      _id: data.class,
      className: "Unknown Class",
    };
  } else {
    // If class is already an object, use it directly
    classData = data.class || { _id: "", className: "" };
  }

  return {
    _id: data._id || "",
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    parent: parentData,
    class: classData,
    school: data.school || "",
    gender: data.gender as "male" | "female",
    language: data.language || "",
    dateOfBirth: data.dateOfBirth || "",
    address: data.address || "",
    aboutMe: data.aboutMe || "",
    hobbies: data.hobbies || [],
    photo: data.photo || "",
    enrolmentDate: data.enrolmentDate || "",
  };
};

interface StudentSettingsWrapperProps {
  studentId: string;
  studentData: ISingleStudent | null;
  onStudentUpdated?: () => void; // Add refresh callback prop
}

export default function StudentSettingsWrapper({
  studentId,
  studentData,
  onStudentUpdated,
}: StudentSettingsWrapperProps) {
  const adaptedData = adaptStudentData(studentData);

  return (
    <StudentSettings
      studentId={studentId}
      studentData={adaptedData}
      onStudentUpdated={onStudentUpdated}
    />
  );
}
