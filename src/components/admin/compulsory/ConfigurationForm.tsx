'use client';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import SchoolItem from './SchoolItem';
import { createClasses, getClasses } from '@/utils/api';
import { IClassConfiguration, IClassConfigurationResponse } from '@/types';

export const formSchema = z.object({
  classname: z.string().min(3).max(50),
  shortname: z.string().min(1).max(25),
  leveltype: z.string().min(1),
  classSection: z.string().max(2, "Section must be at most 2 characters"),
});

interface FORMTYPE extends z.infer<typeof formSchema> {
  edited?: boolean;
  index?: number;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ConfigurationFormProps {
  classType?: string;
}

interface PaginatedResponse {
  data: {
    result: IClassConfigurationResponse[];
    pagination: {
      total: number;
      currentPage: string;
      pageSize: number;
    };
  };
  // message: string;
}

type PropertyKey = 'classname' | 'shortname' | 'leveltype' | 'classSection';

const STEPS = ['nursery', 'primary', 'secondary'];
const LIMIT_OPTIONS = ["10", "20", "50"]; // Options for items per page

function filterUniqueValues(data: FORMTYPE[]) {
  const uniqueValues: FORMTYPE[] = [];
  for (const obj of data) {
    if (!uniqueValues.some((uObj) => areObjectEqual(uObj, obj))) {
      uniqueValues.push(obj);
    }
  }
  return uniqueValues;
}

function areObjectEqual(obj1: FORMTYPE, obj2: FORMTYPE) {
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

  const keys1 = Object.keys(obj1).filter(key => key !== 'index' && key !== 'edited' && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt');
  const keys2 = Object.keys(obj2).filter(key => key !== 'index' && key !== 'edited' && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt');
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (obj1[key as PropertyKey] !== obj2[key as PropertyKey]) return false;
  }
  return true;
}

const ConfigurationForm = ({ classType }: ConfigurationFormProps) => {
  const [activeStep, setActiveStep] = useState(classType || '');
  const [classes, setClasses] = useState<FORMTYPE[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [page, setPage] = useState("1");
  const [limit, setLimit] = useState("10");
  const [totalItems, setTotalItems] = useState(0);

  const form = useForm<FORMTYPE>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      edited: false,
      classname: '',
      shortname: '',
      leveltype: classType || '',
      classSection: '',
    },
  });

  const { setValue, reset } = form;

  useEffect(() => {
    if (classType) {
      setActiveStep(classType.toLowerCase());
      setValue('leveltype', classType.toLowerCase());
    }
  }, [classType, setValue]);

  useEffect(() => {
    if (classType) {
      reset({
        edited: false,
        classname: '',
        shortname: '',
        leveltype: classType.toLowerCase(),
        classSection: '',
      });
    }
  }, [classType, reset]);
  

  async function fetchClasses() {
  try {
    const response = await getClasses(page, limit);
    console.log('Fetched classes:', response);
    setClasses(response.data.result.map((cls, index) => ({
      ...cls,
      classname: cls.className,
      shortname: cls.shortName,
      leveltype: cls.levelType,
      classSection: cls.classSection || '',
      id: cls._id,
      edited: false,
      index,
    })));
    setTotalItems(response.data.pagination.total);
  } catch (error) {
    console.error('Error fetching classes:', error);
  }
}

  useEffect(() => {
    fetchClasses();
  }, [page, limit]);

  async function handleSaveAndSubmit(value: FORMTYPE) {
    try {
      setIsSubmitting(true);
      
      // Update local state only for editing, not for new classes
      const newClasses = [...classes];
      if (editingIndex !== null) {
        newClasses[editingIndex] = { ...value, edited: false };
        setClasses(filterUniqueValues(newClasses));
      }

      // Submit to API as a single object
      const classData: IClassConfiguration = {
        className: value.classname,
        shortName: value.shortname,
        levelType: value.leveltype.toLowerCase() as 'nursery' | 'primary' | 'secondary',
        classSection: value.classSection,
      };

      await createClasses(classData);
      
      // Reset to first page and fetch updated classes from API
      setPage("1");
      await fetchClasses();
      
      // Reset form
      reset({
        edited: false,
        classname: '',
        shortname: '',
        leveltype: classType || '',
        classSection: '',
      });
      setEditingIndex(null);
      
      console.log(editingIndex !== null ? 'Class updated and submitted successfully!' : 'Class added and submitted successfully!');
    } catch (error) {
      console.error('Error saving or submitting class:', error);
      console.log('Failed to save or submit class');
    } finally {
      setIsSubmitting(false);
    }
  }

  function onDelete(items: FORMTYPE[], item: FORMTYPE) {
    const newItems = items.filter((data) => !areObjectEqual(data, item));
    setClasses(newItems);
  }

  function onEdit(item: FORMTYPE, index: number) {
    setEditingIndex(index);
    setValue('classname', item.classname, { shouldValidate: true });
    setValue('leveltype', item.leveltype, { shouldValidate: true });
    setValue('shortname', item.shortname, { shouldValidate: true });
    setValue('classSection', item.classSection, { shouldValidate: true });
  }

  const totalPages = Math.ceil(totalItems / parseInt(limit));
  const currentPage = parseInt(page);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPage((currentPage - 1).toString());
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage((currentPage + 1).toString());
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(e.target.value);
    setPage("1"); // Reset to first page when limit changes
  };

  return (
    <div className='my-4 bg-white px-4 py-8'>
      <div className="flex gap-16 rounded-md">
        <div className="w-[30%] flex flex-col gap-4">
          {STEPS.map((step, index) => {
            const isActive = step === activeStep;
            const isDisabled = classType && step !== classType.toLowerCase();
            
            return (
              <div 
                key={index} 
                className={`flex items-center gap-4 p-2 rounded-md ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => !isDisabled && setActiveStep(step)}
              >
                <span
                  className={`h-8 w-8 flex items-center justify-center rounded-full ${
                    isActive
                      ? 'bg-primaryColor text-white'
                      : 'border border-gray-300 text-black dark:text-gray-300'
                  }`}
                >
                  {index + 1}
                </span>
                <span className={`${isActive ? 'font-medium' : 'text-gray-500'}`}>
                  {`${step.charAt(0).toUpperCase() + step.slice(1)} Class`}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <div className="w-[80%] mx-auto flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="w-[50%]">
                <h3>Enter your classes information</h3>
                <p className="text-muted-foreground text-sm">
                  {classType
                    ? `Configure your ${classType} classes`
                    : 'The following details must be attended to before your account may operate properly.'}
                </p>
              </div>
              <Button className="text-primaryColor bg-transparent hover:bg-[#bdbcbc50]">
                <Plus />
                Add More
              </Button>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSaveAndSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="classname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter class name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a short name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="leveltype"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level Type</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Level type" 
                          {...field} 
                          disabled 
                          value={classType || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="classSection"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Section (up to 2 characters)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter section (e.g. 'a', 'ab')" 
                          maxLength={2}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="text-white w-full bg-primaryColor hover:bg-primaryColor/90"
                  disabled={isSubmitting}
                >
                  {editingIndex !== null ? 'Update' : 'Save'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div>
        {classes.map((item, index) => (
          <SchoolItem
            key={item.id || index}
            classname={item.classname}
            shortname={item.shortname}
            leveltype={item.leveltype}
            classSection={item.classSection}
            onDelete={() => onDelete(classes, item)}
            onEdit={() => onEdit(item, index)}
          />
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <span>Items per page:</span>
          <select
            value={limit}
            onChange={handleLimitChange}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            {LIMIT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationForm;