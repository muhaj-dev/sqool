import React from "react";
import { Separator } from "@/components/ui/separator";
import { useStaffProfile } from '@/hooks/useStaffProfile';

const PersonalInfo = () => {
  const { staffData, loading, error } = useStaffProfile();

  const formatDateOfBirth = (dob: string) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const formattedDate = birthDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return `${formattedDate} (${age} y.o)`;
  };

  const calculateTotalYears = (employedDate: string) => {
    const startDate = new Date(employedDate);
    const currentDate = new Date();
    const years = currentDate.getFullYear() - startDate.getFullYear();
    return years > 0 ? `${years} Years` : "Less than a year";
  };

  if (loading) {
    return (
      <div className="px-4 py-6 flex h-fit border-2 min-[850px]:border-none border-[#F8F8FD] flex-col gap-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-32"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !staffData) {
    return (
      <div className="px-4 py-6 flex h-fit border-2 min-[850px]:border-none border-[#F8F8FD] flex-col gap-4">
        <div className="text-red-500">Error loading personal information</div>
      </div>
    );
  }

  const fullName = `${staffData.firstName} ${staffData.lastName}`;

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
          <p>{staffData.gender || 'Not specified'}</p>
        </div>
        
        {staffData.dateOfBirth && (
          <div className="flex flex-col max-w-[300px]">
            <p className="text-muted-foreground">Date of Birth</p>
            <p>{formatDateOfBirth(staffData.dateOfBirth)}</p>
          </div>
        )}
        
        <div className="flex flex-col max-w-[300px]">
          <p className="text-muted-foreground">Role</p>
          <p>{staffData.role}</p>
        </div>
        
        <div className="flex flex-col max-w-[300px]">
          <p className="text-muted-foreground">Address</p>
          <p>{staffData.address || 'Not specified'}</p>
        </div>
        
        <div className="flex flex-col max-w-[300px]">
          <p className="text-muted-foreground">Qualification</p>
          <p>{staffData.qualification}</p>
        </div>
      </section>
      
      <Separator />
      
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">More Details</h2>
        <p className="text-muted-foreground">About Me</p>
        <p>{staffData.aboutMe || 'No information provided.'}</p>
        
        <div className="flex flex-col gap-4">
          {staffData.employedDate && (
            <div className="flex flex-col max-w-[200px]">
              <p className="text-muted-foreground">Employed Date</p>
              <p>{new Date(staffData.employedDate).toLocaleDateString()}</p>
            </div>
          )}
          
          <div className="flex flex-col max-w-[200px]">
            <p className="text-muted-foreground">Total years with us</p>
            <p>{calculateTotalYears(staffData.experience)}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PersonalInfo;