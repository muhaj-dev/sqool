// components/examinations/EditExamModal.tsx
import { FileEdit, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useExamData } from "@/hooks/useExamData";
import { type Exam } from "@/types";
import { updateExamination } from "@/utils/api";

import { ExamBasicDetailsForm } from "./ExamBasicDetailsForm";
import { QuestionsFileUpload } from "./QuestionsFileUpload";

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

interface EditExamModalProps {
  exam: Exam | null;
  isOpen: boolean;
  onClose: () => void;
  onExamUpdated: () => void;
}
// eslint-disable-next-line prettier/prettier
export const EditExamModal: React.FC<EditExamModalProps> = ({
  exam,
  isOpen,
  onClose,
  onExamUpdated,
}) => {
  const [examData, setExamData] = useState<ExamFormData>({
    subject: "",
    class: "",
    examDate: "",
    startTime: "",
    endTime: "",
    venue: "",
    mode: "online",
    sessionId: "",
  });

  const [questionsFile, setQuestionsFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch classes, subjects, and sessions using the custom hook
  const { classes, subjects, sessions, loading: dataLoading, error } = useExamData();

  // Initialize form with exam data when exam changes
  useEffect(() => {
    if (exam) {
      setExamData({
        subject: exam.subject._id ?? "",
        class: exam.class._id ?? "",
        examDate: exam.examDate ? new Date(exam.examDate).toISOString().split("T")[0] : "",
        startTime: exam.startTime ? formatTimeForInput(exam.startTime) : "",
        endTime: exam.endTime ? formatTimeForInput(exam.endTime) : "",
        venue: exam.venue || "",
        mode: exam.mode || "online",
        sessionId: exam.session._id, // Use session._id instead of sessionId
      });
    }
  }, [exam]);

  // Helper function to format time for input[type="time"]
  const formatTimeForInput = (timeString: string): string => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  const isFormValid = () => {
    return (
      examData.subject &&
      examData.class &&
      examData.examDate &&
      examData.startTime &&
      examData.endTime &&
      examData.sessionId
    );
  };

  const handleSubmit = async () => {
    if (!exam || !isFormValid()) {
      toast({
        title: "Missing required fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // Append all form data
      formData.append("subject", examData.subject);
      formData.append("class", examData.class);
      formData.append("examDate", examData.examDate);
      formData.append("startTime", examData.startTime);
      formData.append("endTime", examData.endTime);
      formData.append("sessionId", examData.sessionId); // Still send as sessionId to API

      // Append optional fields only if they have values
      if (examData.venue) formData.append("venue", examData.venue);
      if (examData.mode) formData.append("mode", examData.mode);

      // Append the file only if a new one is selected
      if (questionsFile) {
        formData.append("questions", questionsFile);
      }

      // Call the API to update exam
      const response = await updateExamination(exam._id, formData);

      toast({
        title: "Exam updated successfully!",
        description: response?.message || "The examination has been updated.",
      });

      onExamUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating exam:", error);
      toast({
        title: "Failed to update exam",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setQuestionsFile(null);
    onClose();
  };

  // Extract filename from questions URL for display
  const getFileNameFromUrl = (url: string): string => {
    if (!url) return "No file uploaded";
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split("/").pop() || "Questions file";
    } catch {
      // If it's not a valid URL, return the original string
      return url.split("/").pop() || "Questions file";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileEdit className="h-5 w-5" />
            Edit Examination
          </DialogTitle>
          <CardDescription>
            Update examination details and upload new questions file if needed
          </CardDescription>
        </DialogHeader>

        <Card>
          <CardContent className="pt-6 space-y-6">
            {error ? (
              <div className="text-center text-red-500 py-4">
                <p>Error loading exam data: {error}</p>
                <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <ExamBasicDetailsForm
                  examData={examData}
                  setExamData={setExamData}
                  classes={classes}
                  subjects={subjects}
                  sessions={sessions}
                  isLoading={dataLoading}
                  isEditMode={true}
                />

                <QuestionsFileUpload
                  questionsFile={questionsFile}
                  setQuestionsFile={setQuestionsFile}
                  isEditMode={true}
                  currentFileName={
                    exam ? getFileNameFromUrl(exam.questions) : "Current questions file"
                  }
                  onDownloadCurrent={() => {
                    // Implement download logic
                    if (exam?.questions) {
                      window.open(exam.questions, "_blank");
                    }
                  }}
                />

                <Separator />

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    className="flex-1"
                    size="lg"
                    disabled={!isFormValid() || isLoading || dataLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating Examination...
                      </>
                    ) : (
                      <>
                        <FileEdit className="h-4 w-4 mr-2" />
                        Update Examination
                      </>
                    )}
                  </Button>
                </div>

                {!isFormValid() && (
                  <p className="text-sm text-muted-foreground text-center">
                    Please fill all required fields (*) to update examination
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
