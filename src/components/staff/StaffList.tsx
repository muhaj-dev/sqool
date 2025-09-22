'use client';
import React, { useState } from 'react';
import TeacherCard from './TeacherCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ListFilter } from 'lucide-react';
import StaffSubbar from './StaffSubbar';
import { Dialog } from '@radix-ui/react-dialog';
import { Separator } from '../ui/separator';
import Filter from '../Filter';
import { StaffResult } from '@/types';
import { useStaff } from '@/contexts/staff-context';

const StaffList = () => {
  const { staffData, loading, error } = useStaff();
  const [selectValue, setSelectValue] = useState('');

  // Sort data based on selectValue
  const sortedData = [...(staffData || [])];
  if (selectValue === 'role') {
    sortedData.sort((a, b) => (a?.role ?? '').localeCompare(b?.role ?? ''));
  } else if (selectValue === 'level') {
    sortedData.sort((a, b) => (a?.level ?? '').localeCompare(b?.level ?? ''));
  } else if (selectValue === 'primarySubject') {
    sortedData.sort((a, b) =>
      (a?.primarySubject ?? '').localeCompare(b?.primarySubject ?? ''),
    );
  }

  return (
    <Dialog>
      <StaffSubbar />
      <div className="bg-white min-h-[100vh]">
        <div className="w-[95%] mx-auto py-4">
          <h3 className="text-xl font-semibold">Teacher</h3>
          {loading && <p>Loading staff...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex items-center justify-between my-4 flex-wrap gap-2">
            <Select
              onValueChange={(value) => {
                setSelectValue(value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primarySubject">Primary Subject</SelectItem>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="level">Level</SelectItem>
              </SelectContent>
            </Select>
            <Filter />
          </div>
          <div>
            {sortedData.length === 0 ? (
              <p>No Staff avaliable</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {sortedData.map((staff) => (
                  <TeacherCard key={staff?._id} item={staff} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default StaffList;
