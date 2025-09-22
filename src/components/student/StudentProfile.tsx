import React from "react";
import { Separator } from "../ui/separator";
import { useStudent } from "@/contexts/student-context";
// import { ISingleStudent } from "@/types"
import { calculateAge, formatDate } from "@/utils/lib";

const StudentProfile = () => {
  const {
    studentId: contextStudentId,
    studentData,
    loading,
    error,
  } = useStudent();

  if (loading) {
    return <div>Loading student data...</div>;
  }

  if (error || !studentData) {
    return <div>Error: {error || "Student data not available"}</div>;
  }

  console.log(studentData);

  const { firstName, lastName, gender, hobbies } = studentData;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Personal Info</h2>
      <section className="grid grid-cols-2 gap-y-4">
        <div className="capitalize flex flex-col max-w-[300px]">
          <p className="text-muted-foreground">Full Name</p>
          <p>{`${firstName} ${lastName}`}</p>
        </div>
        <div className="capitalize flex flex-col max-w-[300px]">
          <p className="text-muted-foreground">Gender</p>
          <p>{gender || "Not specified"}</p>
        </div>
        <div className="capitalize flex flex-col max-w-[300px]">
          <p className="text-muted-foreground">Date of Birth</p>
          <p>
            {studentData.dateOfBirth ? (
              <>
                {formatDate(studentData.dateOfBirth)}{" "}
                <span className="text-muted-foreground">
                  ({calculateAge(studentData.dateOfBirth)} y.o)
                </span>
              </>
            ) : (
              "No birth date available"
            )}
          </p>
        </div>
        <div className="capitalize flex flex-col max-w-[300px]">
          <p className="text-muted-foreground">Language</p>
          <p>{studentData.language}</p>
        </div>
        <div className="flex flex-col max-w-[300px]">
          <p className="text-muted-foreground">Address</p>
          <p>{studentData.address}</p>
        </div>
      </section>
      <Separator />
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">More Details</h2>
        <p className="text-muted-foreground">About Me</p>
        <p>{studentData.aboutMe}</p>
        {/* <div className="flex gap-8">
          <div className="flex flex-col max-w-[200px]">
            <p className="text-muted-foreground">Employed Date</p>
            <p>March 23, 1999</p>
          </div>
          <div className="flex flex-col max-w-[200px]">
            <p className="text-muted-foreground">Total year spends with us</p>
            <p>6 Years</p>
          </div>
        </div> */}
        <div>
          <p className="text-muted-foreground mb-2">Hobbies</p>
          <div className="flex items-center gap-4">
            {hobbies.map((hobby, index) => (
              <p
                key={index}
                className="bg-[#F8F8FD] py-2 px-4 text-[#4640DE] capitalize"
              >
                {hobby}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentProfile;
