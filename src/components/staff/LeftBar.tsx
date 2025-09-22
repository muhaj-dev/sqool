'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Instagram, Mail, Smartphone, Star, Twitter } from 'lucide-react';
import { Separator } from '../ui/separator';
import { StaffResult } from '@/types';

interface LeftBarProps {
  staffId: string;
  staff: StaffResult | null;
  loading: boolean;
  error: string | null;
}


const LeftBar = ({ staffId, staff, loading, error }: LeftBarProps) => {
  if (loading) {
    return (
      <div className="bg-white min-w-[25%] py-8 px-4 max-h-screen">
        Loading...
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="bg-white min-w-[25%] py-8 px-4 max-h-screen">
        <p className="text-red-500">{error || 'Staff not found'}</p>
      </div>
    );
  }

  const fullName = staff.userId
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
    <div className="bg-white min-w-[25%] py-8 px-4 max-h-screen flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/images/user.png" />
          <AvatarFallback>
            {staff.userId
              ? `${staff.userId?.firstName?.[0]}${staff.userId?.lastName?.[0]}`
              : 'JB'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center items-baseline">
          <p className="text-2xl font-semibold">{fullName}</p>
          <p>ID {staff._id?.slice(0, 6) ?? 'AM21-10'}</p>
          <div className="flex items-center gap-1">
            <Star className="text-yellow-400" size={20} />
            <span className="text-[18px]">4.0</span>
          </div>
        </div>
      </div>
      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <p className="text-muted-foreground">Teaching Role</p>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold capitalize">
            {staff?.primarySubject ?? 'N/A'}
          </p>
          <span className="bg-[#5542F61A] px-2 py-1 rounded-sm text-[#5542F6]">
            {'Full time'}
          </span>
        </div>
      </div>
      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Sub Subject</p>
          <p className="">{staff?.subjects?.[0] ?? 'Chemistry'}</p>
        </div>
      </div>

      {/* <Separator />
      <div className="flex flex-col gap-4">
        <p className="text-xl">Contact</p>
        <div className="flex gap-6">
          <Mail className="text-muted-foreground" size={20} />
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="text-[14px]">{staff?.email ?? 'Not available'}</p>
          </div>
        </div>
        <div className="flex gap-6">
          <Smartphone className="text-muted-foreground" size={23} />
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="text-[14px]">{phone}</p>
          </div>
        </div>
        <div className="flex gap-6">
          <Instagram className="text-muted-foreground" size={20} />
          <div>
            <p className="text-muted-foreground">Instagram</p>
            <p className="text-[14px]">{instagram}</p>
          </div>
        </div>
        <div className="flex gap-6">
          <Twitter className="text-muted-foreground" size={22} />
          <div>
            <p className="text-muted-foreground">Twitter</p>
            <p className="text-[14px]">{twitter}</p>
          </div>
        </div>
      </div> */}
    
    </div>
  );
};

export default LeftBar;