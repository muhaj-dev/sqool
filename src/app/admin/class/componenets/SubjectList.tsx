import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createSubject, getSubjects } from "@/utils/api"; // <-- Import getSubjects

interface Subject {
  _id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  isActive: boolean;
  prerequisites: any[];
  slug: string;
}

interface SubjectListProps {
  classes?: { id: string; name: string }[];
  classData: any;
  onRefresh: () => void;
}

const SubjectList = ({ classes = [], classData, onRefresh }: SubjectListProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    _id: "",
    name: "",
    code: "",
    category: "",
    description: "",
    classes: [] as string[], // <-- Add classIds to form
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classInputFocused, setClassInputFocused] = useState(false);
  const [classSearch, setClassSearch] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectSearch, setSubjectSearch] = useState("");


   // Fetch subjects from API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getSubjects(1, subjectSearch); // page=1, search query
        setSubjects(response.data.result);
      } catch (err) {
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, [subjectSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleClassSelect = (classId: string) => {
    if (!form.classes.includes(classId)) {
      setForm({ ...form, classes: [...form.classes, classId] });
    }
    setClassInputFocused(false);
    setClassSearch("");
  };

  const handleClassRemove = (classId: string) => {
    setForm({ ...form, classes: form.classes.filter((id) => id !== classId) });
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(classSearch.toLowerCase()) &&
      !form.classes.includes(cls.id)
  );


const handleCreateSubject = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  try {
    const { _id, ...payload } = form;
    await createSubject(payload); 
    onRefresh()
    setModalOpen(false);
    setForm({ _id: "", name: "", code: "", category: "", description: "", classes: [] });
  } catch (err: any) {
    setError(err.message || "Error creating subject");
  } finally {
    setLoading(false);
  }
};


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Available Subjects</CardTitle>
          <CardDescription>
            Subjects in {classData?.className} {classData?.classSection ?? ''}
          </CardDescription>
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="text-white" variant="default" onClick={() => setModalOpen(true)}>
              + Create Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subject</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleCreateSubject}>
              <Input
                name="name"
                placeholder="Subject Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                name="code"
                placeholder="Subject Code"
                value={form.code}
                onChange={handleChange}
                required
              />
              <Input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                required
              />
              <Textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
              />
              {/* Classes Multi-select */}
              <div className="relative">
    <Input
      placeholder="Add classes..."
      value={classSearch}
      onFocus={() => setClassInputFocused(true)}
      onBlur={() => setTimeout(() => setClassInputFocused(false), 150)}
      onChange={(e) => setClassSearch(e.target.value)}
      className="w-full"
    />
    {classInputFocused && filteredClasses.length > 0 && (
      <div className="absolute z-10 bg-white border rounded shadow w-full mt-1 max-h-40 overflow-auto">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="px-4 py-2 cursor-pointer hover:bg-blue-50"
            onMouseDown={() => handleClassSelect(cls.id)}
          >
            {cls.name}
          </div>
        ))}
      </div>
    )}
  </div>
  {/* Selected Classes */}
  {form.classes.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {form.classes.map((classId) => {
        const cls = classes.find((c) => c.id === classId);
        return (
          <Badge key={classId} variant="secondary" className="flex items-center gap-2">
            {cls?.name}
            <button
              type="button"
              className="ml-2 text-xs text-red-500"
              onClick={() => handleClassRemove(classId)}
            >
              &times;
            </button>
          </Badge>
        );
      })}
    </div>
  )}
            
              {error && <div className="text-red-500">{error}</div>}
              <Button className="text-white" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Subject"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <ScrollArea className=" h-[480px]">
          <div className="space-y-4 h-fit overflow-auto">
            {subjects.map((subject) => (
              <div key={subject._id} className="p-4 border border-[#c3c3c3] rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{subject.name}</h4>
                    <p className="text-sm text-muted-foreground">{subject.code}</p>
                    <p className="text-sm text-muted-foreground">{subject.description}</p>
                  </div>
                <div className="gap-2 flex flex-col justify-between">
                    <p className="text-sm text-muted-foreground">{subject.category}</p>


                </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SubjectList;