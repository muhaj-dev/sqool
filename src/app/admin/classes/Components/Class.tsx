'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import AdminTable from '@/components/Constant/Table/AdminTable';
import {
  Dialog,
  DialogTrigger,
  DialogClose,
} from '@radix-ui/react-dialog';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  IClassConfiguration,
  ClassPaginationResponse,
  IClassConfigurationResponse,
  IStudent,
  ISubject,
  ISubjectResponse,
} from '@/types';
import {
  getClasses,
  createClasses,
  updateClass,
  deleteClass,
  createSubject,
} from '@/utils/api';

const Class = () => {
  const [classes, setClasses] = useState<IClassConfigurationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editClassModalOpen, setEditClassModalOpen] = useState(false);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [selectedClass, setSelectedClass] =
    useState<IClassConfigurationResponse | null>(null);
  const [classData, setClassData] = useState<IClassConfiguration>({
    className: '',
    shortName: '',
    levelType: 'nursery',
    classSection: '',
  });
  const [subjectData, setSubjectData] = useState<ISubject>({
    name: '',
    code: '',
    category: '',
    description: '',
  });
  const [pagination, setPagination] = useState<
    ClassPaginationResponse['data']['pagination']
  >({
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    nextPage: null,
    previousPage: null,
  });

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await getClasses('1', '10');
        setClasses(response.data.result || []);
        setPagination(response.data.pagination || pagination);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch classes',
        );
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [refresh]);

  // Transform IClassConfigurationResponse into IStudent-compatible data
  const transformedClasses = (): IStudent[] => {
    return classes.map((cls) => ({
      _id: cls._id,
      photo: '/images/class.png',
      firstName: cls.className,
      lastName: cls.shortName,
      class: {
        _id: cls._id,
        className: cls.className,
      },
      parent: {
        _id: cls._id,
        userId: {
          firstName: 'N/A',
          lastName: 'N/A',
        },
        isActive: true,
      },
      gender: undefined,
      hobbies: [],
    }));
  };

  // Handle Add Class
  const handleAddClass = async () => {
    try {
      const response = await createClasses(classData);
      setClasses([...classes, response]);
      setRefresh(!refresh);
      toast({ title: 'Success', description: 'Class added successfully.' });
      setClassModalOpen(false);
      setClassData({
        className: '',
        shortName: '',
        levelType: 'nursery',
        classSection: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to add class.',
        variant: 'destructive',
      });
    }
  };

  // Handle Add Subject
  const handleAddSubject = async () => {
    try {
      const response = await createSubject(subjectData);
      setRefresh(!refresh);
      toast({ title: 'Success', description: 'Subject added successfully.' });
      setSubjectModalOpen(false);
      setSubjectData({
        name: '',
        code: '',
        category: '',
        description: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to add subject.',
        variant: 'destructive',
      });
    }
  };

  // Handle Update Class
  const handleUpdateClass = async () => {
    if (!selectedClass?._id) return;
    try {
      const response = await updateClass(selectedClass._id, classData);
      setClasses(
        classes.map((cls) => (cls._id === selectedClass._id ? response : cls)),
      );
      toast({ title: 'Success', description: 'Class updated successfully.' });
      setEditClassModalOpen(false);
      setSelectedClass(null);
      setClassData({
        className: '',
        shortName: '',
        levelType: 'nursery',
        classSection: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update class.',
        variant: 'destructive',
      });
    }
  };

  // Handle Delete Class
  const handleDeleteClass = async (id: string) => {
    try {
      await deleteClass(id);
      setClasses(classes.filter((cls) => cls._id !== id));
      toast({ title: 'Success', description: 'Class deleted successfully.' });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to delete class.',
        variant: 'destructive',
      });
    }
  };

  // Render Class Name
  const RenderClassName = ({ item }: { item: IStudent }) => {
    return (
      <div className="flex gap-2 items-center">
        <p className="text-[16px] font-medium text-[#3F4946]">{`${item.firstName} (${item.lastName})`}</p>
      </div>
    );
  };

  // Render Short Name
  const RenderShortName = ({ item }: { item: IStudent }) => {
    return (
      <p className="text-[14px] text-[#3F4946] font-medium">{item.lastName}</p>
    );
  };

  // Render Class Teacher
  const RenderClassTeacher = ({ item }: { item: IStudent }) => {
    const originalClass = classes.find((cls) => cls._id === item._id);
    if (!originalClass || !originalClass.classTeacher) {
      return <p className="text-[14px] text-[#3F4946] font-medium">N/A</p>;
    }
    return (
      <div className="flex flex-col">
        {originalClass.classTeacher.map((teacher, index) => (
          <span key={index} className="text-[14px] text-[#3F4946] font-medium">
            {teacher}
            {index < originalClass.classTeacher.length - 1 && ', '}
          </span>
        ))}
        {originalClass.classTeacher.length > 2 && (
          <span className="text-[12px] text-gray-500">
            +{originalClass.classTeacher.length - 2} more
          </span>
        )}
      </div>
    );
  };

  // Render Actions
  const RenderAction = ({ item }: { item: IStudent }) => {
    const originalClass = classes.find((cls) => cls._id === item._id);
    if (!originalClass) return null;
    return (
      <div className="flex space-x-2">
        <Button
          onClick={() => {
            setSelectedClass(originalClass);
            setClassData({
              className: originalClass.className,
              shortName: originalClass.shortName,
              levelType: originalClass.levelType,
              classSection: originalClass.classSection || '',
            });
            setEditClassModalOpen(true);
          }}
          className="text-[14px] border-[#E9EBEB] border-[1px] text-primaryColor bg-white font-medium py-[6px] px-[12px] rounded-md hover:bg-gray-100"
        >
          Edit
        </Button>
        <Button
          onClick={() => handleDeleteClass(originalClass._id)}
          className="text-[14px] border-[#E9EBEB] border-[1px] bg-primaryColor text-white font-medium py-[6px] px-[12px] rounded-md hover:bg-gray-100"
        >
          Delete
        </Button>
      </div>
    );
  };

  const columns = [
    {
      key: 'class',
      label: 'Class',
      renderCell: (item: IStudent) => <RenderClassName item={item} />,
    },
    {
      key: 'shortName',
      label: 'Short Name',
      renderCell: (item: IStudent) => <RenderShortName item={item} />,
    },
    {
      key: 'classTeacher',
      label: 'Class Teacher',
      renderCell: (item: IStudent) => <RenderClassTeacher item={item} />,
    },
    {
      key: 'action',
      label: 'Actions',
      renderCell: (item: IStudent) => <RenderAction item={item} />,
    },
  ];

  const sortOptions = [
    { label: 'A-Z', value: 'asc' },
    { label: 'Z-A', value: 'desc' },
  ];

  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Nursery', value: 'nursery' },
    { label: 'Primary', value: 'primary' },
    { label: 'Secondary', value: 'secondary' },
  ];

  if (loading) return <div>Loading classes...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Dialog>
      <div className="flex items-center flex-wrap gap-2 justify-between mb-4">
        <div className="w-full md:w-[50%]">
          <h3 className="text-2xl font-bold text-gray-800">
            Classes and Subjects
          </h3>
        </div>
        <div className="flex gap-2">
          <DialogTrigger className="flex items-center gap-2 bg-primaryColor text-white py-2 px-4 rounded-md hover:bg-primaryColor transition">
            <Plus size={16} />
            Add Class
          </DialogTrigger>
          <DialogTrigger
            asChild
            onClick={() => setSubjectModalOpen(true)}
          >
            <button className="flex items-center gap-2 bg-primaryColor text-white py-2 px-4 rounded-md hover:bg-primaryColor transition">
              <Plus size={16} />
              Add Subject
            </button>
          </DialogTrigger>
        </div>
      </div>
      <div className="bg-white p-4 rounded-md">
        <AdminTable
          title="Classes"
          columns={columns}
          data={transformedClasses()}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          pagination={pagination}
          showItemCheck={false}
          onPageChange={(page) => {
            // Implement page change logic if needed
          }}
          sortOptions={sortOptions}
          statusOptions={statusOptions}
          onSort={(sortValue) => console.log('Sort by:', sortValue)}
          onStatusFilterChange={(status) => console.log('Filter by:', status)}
          onRecordClicked={(cls) =>
            console.log('Class clicked (transformed):', cls)
          }
        />
      </div>

      {/* Add Class Modal */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Enter details for the new class.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <input
            type="text"
            placeholder="Class Name"
            value={classData.className}
            onChange={(e) =>
              setClassData({ ...classData, className: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
          />
          <input
            type="text"
            placeholder="Short Name"
            value={classData.shortName}
            onChange={(e) =>
              setClassData({ ...classData, shortName: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
          />
          <select
            value={classData.levelType}
            onChange={(e) =>
              setClassData({
                ...classData,
                levelType: e.target.value as
                  | 'nursery'
                  | 'primary'
                  | 'secondary',
              })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
          >
            <option value="nursery">Nursery</option>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
          </select>
          <input
            type="text"
            placeholder="Class Section"
            value={classData.classSection || ''}
            onChange={(e) =>
              setClassData({ ...classData, classSection: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
          />
        </div>
        <div className='w-fit ml-auto'>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="mr-2 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleAddClass}
            className="bg-primaryColor text-white hover:bg-primaryColor"
          >
            Add Class
          </Button>
        </div>
      </DialogContent>

      {/* Add Subject Modal */}
      <Dialog open={subjectModalOpen} onOpenChange={setSubjectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
            <DialogDescription>
              Enter details for the new subject.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="text"
              placeholder="Subject Name"
              value={subjectData.name}
              onChange={(e) =>
                setSubjectData({ ...subjectData, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
            <input
              type="text"
              placeholder="Subject Code"
              value={subjectData.code}
              onChange={(e) =>
                setSubjectData({ ...subjectData, code: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
            <input
              type="text"
              placeholder="Category"
              value={subjectData.category}
              onChange={(e) =>
                setSubjectData({ ...subjectData, category: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
            <textarea
              placeholder="Description"
              value={subjectData.description}
              onChange={(e) =>
                setSubjectData({ ...subjectData, description: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor min-h-[100px]"
            />
          </div>
          <div className="w-fit ml-auto">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="mr-2 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleAddSubject}
              className="bg-primaryColor text-white hover:bg-primaryColor"
            >
              Add Subject
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Class Modal */}
      <Dialog open={editClassModalOpen} onOpenChange={setEditClassModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>Update details for the class.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="text"
              placeholder="Class Name"
              value={classData.className}
              onChange={(e) =>
                setClassData({ ...classData, className: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
            <input
              type="text"
              placeholder="Short Name"
              value={classData.shortName}
              onChange={(e) =>
                setClassData({ ...classData, shortName: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
            <select
              value={classData.levelType}
              onChange={(e) =>
                setClassData({
                  ...classData,
                  levelType: e.target.value as
                    | 'nursery'
                    | 'primary'
                    | 'secondary',
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
            >
              <option value="nursery">Nursery</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </select>
            <input
              type="text"
              placeholder="Class Section"
              value={classData.classSection || ''}
              onChange={(e) =>
                setClassData({ ...classData, classSection: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
          </div>
          <div className='w-fit ml-auto'>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="mr-2 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleUpdateClass}
              className="bg-primaryColor text-white hover:bg-primaryColor"
            >
              Update Class
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default Class;