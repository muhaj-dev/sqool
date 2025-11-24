import StudentPageClient from "./StudentPageClient";

export default async function Page({ params }: { params: Promise<{ studentId: string }> }) {
  try {
    const { studentId } = await params;

    // Validate studentId
    if (!studentId || studentId.trim() === "") {
      throw new Error("Invalid studentId");
    }

    return (
      <div className="w-full bg-white px-0 md:px-4">
        {/* <p>Student ID: {studentId}</p> */}
        <StudentPageClient studentId={studentId} />
      </div>
    );
  } catch (error) {
    console.error("Error in dynamic route:", error);
    throw error; // This will trigger your error boundary
  }
}
