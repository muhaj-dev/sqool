// components/class-management/CreateClassDialog.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Class, ClassFormData, Teacher } from "./types";
import { basicClasses, secondaryClasses, secondaryStreams } from "./utils";

interface CreateClassDialogProps {
  teachers: Teacher[];
  classes: Class[];
  setClasses: (classes: Class[]) => void;
  onRefresh?: () => void; // <-- Add onRefresh prop
}

const CreateClassDialog = ({ teachers, classes, setClasses, onRefresh }: CreateClassDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newClass, setNewClass] = useState<ClassFormData>({
    name: "",
    level: "",
    stream: "",
    description: "",
    capacity: "",
    classTeacherId: "",
  });

  const handleCreateClass = () => {
    if (newClass.name && newClass.level && newClass.description && newClass.capacity) {
      const classTeacher = teachers.find((t) => t.id === newClass.classTeacherId) || null;

      const classData: Class = {
        id: Date.now().toString(),
        name: newClass.name,
        level: newClass.level,
        stream: newClass?.stream || undefined,
        description: newClass.description,
        capacity: parseInt(newClass.capacity),
        classTeacher,
        subjects: [],
        schedules: [],
        resources: [],
        createdAt: new Date().toISOString().split("T")[0],
      };

      setClasses([...classes, classData]);
      setNewClass({
        name: "",
        level: "",
        stream: "",
        description: "",
        capacity: "",
        classTeacherId: "",
      });
      setOpen(false);
       if (onRefresh) onRefresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white hover:bg-primary/55">
          <Plus className="h-4 w-4 mr-2" />
          Create Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
          <DialogDescription>
            Add a new class following the Nigerian education system structure.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="classLevel">Education Level</Label>
              <Select
                value={newClass.level}
                onValueChange={(value) =>
                  setNewClass({ ...newClass, level: value, stream: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Education</SelectItem>
                  <SelectItem value="secondary">Secondary Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="className">Class Name</Label>
              <Select
                value={newClass.name}
                onValueChange={(value) =>
                  setNewClass({ ...newClass, name: value })
                }
                disabled={!newClass.level}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {newClass.level === "basic" &&
                    basicClasses.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  {newClass.level === "secondary" &&
                    secondaryClasses.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {newClass.level === "secondary" && (
            <div>
              <Label htmlFor="classStream">Stream</Label>
              <Select
                value={newClass.stream}
                onValueChange={(value) =>
                  setNewClass({ ...newClass, stream: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stream" />
                </SelectTrigger>
                <SelectContent>
                  {secondaryStreams.map((stream) => (
                    <SelectItem key={stream.value} value={stream.value}>
                      {stream.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="classDescription">Description</Label>
            <Textarea
              id="classDescription"
              placeholder="Brief description of the class"
              value={newClass.description}
              onChange={(e) =>
                setNewClass({
                  ...newClass,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="classCapacity">Class Capacity</Label>
              <Input
                id="classCapacity"
                type="number"
                placeholder="Maximum students"
                value={newClass.capacity}
                onChange={(e) =>
                  setNewClass({ ...newClass, capacity: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="classTeacher">Class Teacher</Label>
              <Select
                value={newClass.classTeacherId}
                onValueChange={(value) =>
                  setNewClass({ ...newClass, classTeacherId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName} -{" "}
                      {teacher.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleCreateClass} className="w-full text-white">
            Create Class
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassDialog;