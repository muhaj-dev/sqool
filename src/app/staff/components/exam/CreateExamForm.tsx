import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Plus, FileEdit, Loader2 } from "lucide-react";
import { ExamBasicDetailsForm } from "./ExamBasicDetailsForm";
import { QuestionsFileUpload } from "./QuestionsFileUpload";
import { useExamData } from "@/hooks/useExamData";

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

interface CreateExamFormProps {
  onCreateExam: (examData: ExamFormData, questionsFile: File | null) => void;
  isLoading: boolean;
}

export const CreateExamForm: React.FC<CreateExamFormProps> = ({
  onCreateExam,
  isLoading: formLoading
}) => {
  const [examData, setExamData] = useState<ExamFormData>({
    subject: "",
    class: "",
    examDate: "",
    startTime: "",
    endTime: "",
    venue: "",
    mode: "online",
    sessionId: ""
  });
  
  const [questionsFile, setQuestionsFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  // Fetch classes, subjects, and sessions using the custom hook
  const { classes, subjects, sessions, loading: dataLoading, error } = useExamData();

  const isFormValid = () => {
    return examData.subject && 
           examData.class && 
           examData.examDate && 
           examData.startTime && 
           examData.endTime && 
           examData.sessionId && 
           questionsFile;
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      toast({
        title: "Missing required fields",
        description: "Please fill all required fields and upload a questions file.",
        variant: "destructive"
      });
      return;
    }
    onCreateExam(examData, questionsFile);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center text-red-500">
            <p>Error loading exam data: {error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileEdit className="h-5 w-5" />
          Create New Examination
        </CardTitle>
        <CardDescription>
          Set up examination details and upload questions file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ExamBasicDetailsForm 
          examData={examData} 
          setExamData={setExamData}
          classes={classes}
          subjects={subjects}
          sessions={sessions}
          isLoading={dataLoading}
        />
        
        <QuestionsFileUpload 
          questionsFile={questionsFile} 
          setQuestionsFile={setQuestionsFile} 
        />
        
        <Separator />
        
        <Button 
          onClick={handleSubmit} 
          className="w-full" 
          size="lg"
          disabled={!isFormValid() || formLoading || dataLoading}
        >
          {formLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Examination...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Examination
            </>
          )}
        </Button>
        
        {!isFormValid() && (
          <p className="text-sm text-muted-foreground text-center">
            Please fill all required fields (*) to create examination
          </p>
        )}
      </CardContent>
    </Card>
  );
};