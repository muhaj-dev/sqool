import React from "react";
import { Separator } from "@/components/ui/separator";
import { StaffResult } from "@/types";

const TeacherProfile = ({ staffId, staff }: { staffId: string; staff: StaffResult | null }) => {
  const fullName = staff?.userId
    ? `${staff.userId?.firstName} ${staff.userId?.lastName}`
    : 'Unknown Staff';
  const email = 'No email provided'; // Email not available in StaffResult
  const phone = staff?.address
    ? `+${staff.address?.split(',')?.[0]?.trim()}`
    : '+44 1245 572 135';
  const address = staff?.address
    ? `${staff.address}`
    : '43 awayewaserere street ejigun ayetoro itele ogun state';
  const instagram = staff?.aboutMe
    ? `instagram.com/${staff.aboutMe?.split(' ')?.[0]?.toLowerCase()}`
    : 'instagram.com/jeromebell';
  const twitter = staff?.aboutMe
    ? `twitter.com/${staff.aboutMe?.split(' ')?.[0]?.toLowerCase()}`
    : 'twitter.com/jeromebell';
  const aboutMe = staff?.aboutMe ? staff?.aboutMe : 'Not available';

  return (
    <div className="px-4 py-6 flex h-fit border-2 min-[850px]:border-none border-[#F8F8FD] flex-col gap-4">
      <h2 className="text-lg font-semibold">Personal Info</h2>
      <section className="grid grid-cols-2 gap-y-4">
        <div className="flex flex-col max-w-[300px]">
          <p className="text-muted-foreground">Full Name</p>
          <p>{fullName}</p>
        </div>
        <div className="flex flex-col max-w-[300px]">
          <p className="text-muted-foreground">Gender</p>
          <p>Male</p>
        </div>
        <div className="flex flex-col max-w-[300px]">
          <p className="text-muted-foreground">Date of Birth</p>
          <p>
            March 23, 1995{' '}
            <span className="text-muted-foreground">(26 y.o)</span>{' '}
          </p>
        </div>
        <div className="flex flex-col max-w-[300px]">
          <p className="text-muted-foreground">Language</p>
          <p>English, French</p>
        </div>
        <div className="flex flex-col max-w-[300px]">
          <p className="text-muted-foreground">Address</p>
          <p>{address}</p>
        </div>
      </section>
      <Separator />
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">More Details</h2>
        <p className="text-muted-foreground">About Me</p>
        <p>{aboutMe}</p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col max-w-[200px]">
            <p className="text-muted-foreground">Employed Date</p>
            <p>March 23, 1999</p>
          </div>
          <div className="flex flex-col max-w-[200px]">
            <p className="text-muted-foreground">Total year spends with us</p>
            <p>6 Years</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeacherProfile;
