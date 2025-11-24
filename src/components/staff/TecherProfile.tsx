import { Separator } from "@/components/ui/separator";
import { type StaffResult } from "@/types";

const TeacherProfile = ({ staffId, staff }: { staffId: string; staff: StaffResult | null }) => {
  const fullName = staff?.userId
    ? `${staff.userId?.firstName} ${staff.userId?.lastName}`
    : "Unknown Staff";

  const email = staff?.userId?.email || "No email provided";
  const phone = staff?.phoneNumber || "+44 1245 572 135";
  const address = staff?.address || "43 awayewaserere street ejigun ayetoro itele ogun state";
  const aboutMe = staff?.aboutMe || "Not available";
  // const language = staff?.language || "Not specified";
  const qualification = staff?.qualification || "Not specified";
  const primarySubject = staff?.primarySubject || "Not assigned";
  const role = staff?.role || "Not specified";
  const level = staff?.level || "Not specified";

  // Format dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Calculate years of experience
  const calculateYearsWithUs = (employmentDate: string | undefined) => {
    if (!employmentDate) return "N/A";
    try {
      const startDate = new Date(employmentDate);
      const today = new Date();
      const years = today.getFullYear() - startDate.getFullYear();
      const months = today.getMonth() - startDate.getMonth();

      if (months < 0) {
        return `${years - 1} year${years - 1 !== 1 ? "s" : ""}`;
      }
      return `${years} year${years !== 1 ? "s" : ""}`;
    } catch {
      return "N/A";
    }
  };

  const dateOfBirth = formatDate(staff?.dateOfBirth);
  const employmentDate = formatDate(staff?.employmentDate);
  const experienceDate = formatDate(staff?.experience);
  const yearsWithUs = calculateYearsWithUs(staff?.employmentDate);

  // Format hobbies
  const hobbies = staff?.hobbies?.length ? staff.hobbies.join(", ") : "No hobbies listed";

  return (
    <div className="px-4 py-6 flex h-fit border-2 min-[850px]:border-none border-[#F8F8FD] flex-col gap-4">
      <h2 className="text-lg font-semibold">Personal Info</h2>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
        <div className="flex flex-col">
          <p className="text-muted-foreground">Full Name</p>
          <p className="font-medium">{fullName}</p>
        </div>

        <div className="flex flex-col">
          <p className="text-muted-foreground">Email</p>
          <p className="font-medium">{email}</p>
        </div>

        <div className="flex flex-col">
          <p className="text-muted-foreground">Phone Number</p>
          <p className="font-medium">{phone}</p>
        </div>

        <div className="flex flex-col">
          <p className="text-muted-foreground">Date of Birth</p>
          <p className="font-medium">{dateOfBirth}</p>
        </div>

        <div className="flex flex-col">
          <p className="text-muted-foreground">Role</p>
          <p className="font-medium capitalize">{role}</p>
        </div>

        <div className="flex flex-col">
          <p className="text-muted-foreground">Level</p>
          <p className="font-medium">{level}</p>
        </div>

        <div className="flex flex-col">
          <p className="text-muted-foreground">Primary Subject</p>
          <p className="font-medium">{primarySubject}</p>
        </div>
      </section>

      <div className="flex flex-col">
        <p className="text-muted-foreground">Address</p>
        <p className="font-medium">{address}</p>
      </div>

      <Separator />

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Professional Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <p className="text-muted-foreground">Qualification</p>
            <p className="font-medium">{qualification}</p>
          </div>

          <div className="flex flex-col">
            <p className="text-muted-foreground">Employment Date</p>
            <p className="font-medium">{employmentDate}</p>
          </div>

          <div className="flex flex-col">
            <p className="text-muted-foreground">Experience Since</p>
            <p className="font-medium">{experienceDate}</p>
          </div>

          <div className="flex flex-col">
            <p className="text-muted-foreground">Years with School</p>
            <p className="font-medium">{yearsWithUs}</p>
          </div>
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Personal Details</h2>

        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">About Me</p>
          <p className="font-medium">{aboutMe}</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">Hobbies</p>
          <p className="font-medium">{hobbies}</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">Status</p>
          <p className="font-medium">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                staff?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {staff?.isActive ? "Active" : "Inactive"}
            </span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default TeacherProfile;
