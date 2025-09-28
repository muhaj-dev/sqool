import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { createExamination } from "@/utils/api";
import { CreateExamForm } from "./CreateExamForm";
import { ExamList } from "./ExamList";
import { ExamResults } from "./ExamResults";
import { QuestionBuilder } from "./QuestionBuilder";

// Types
interface ExamFormData {
  subject: string;
  class: string;
  examDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  mode: string;
  sessionId: string;
}

interface ExamItem {
  id: number;
  title: string;
  subject: string;
  class: string;
  questions: number;
  duration: string;
  status: string;
  created: string;
}

// Main Examinations Component
export const Examinations = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();


  const handleCreateExam = async (examData: ExamFormData, questionsFile: File | null) => {
    if (!questionsFile) {
      toast({
        title: "No questions file",
        description: "Please upload a questions file.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      
      // Append all form data - now sending the actual IDs
      formData.append('subject', examData.subject); // Subject ID
      formData.append('class', examData.class); // Class ID
      formData.append('examDate', examData.examDate);
      formData.append('startTime', examData.startTime);
      formData.append('endTime', examData.endTime);
      formData.append('sessionId', examData.sessionId); // Session ID
      
      // Append optional fields only if they have values
      if (examData.venue) formData.append('venue', examData.venue);
      if (examData.mode) formData.append('mode', examData.mode);
      
      // Append the file
      formData.append('questions', questionsFile);

      // Call the API
      const response = await createExamination(formData);

      toast({
        title: "Exam created successfully!",
        description: response?.message || "The examination has been scheduled.",
      });

      // Reset form by switching tabs
      setActiveTab("manage");
      
    } catch (error) {
      console.error('Error creating exam:', error);
      toast({
        title: "Failed to create exam",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Examinations</h1>
          <p className="text-muted-foreground">Create and manage exam questions and tests</p>
        </div>
        
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Examination</TabsTrigger>
          <TabsTrigger value="manage">Manage Exams</TabsTrigger>
          <TabsTrigger value="results">View Results</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <CreateExamForm onCreateExam={handleCreateExam} isLoading={isLoading} />
          <QuestionBuilder />
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <ExamList  />
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <ExamResults />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Examinations;