import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Users, 
  MapPin, 
  Monitor,
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  MoreVertical
} from "lucide-react";
import { Exam } from "@/types";
import { updateExamination, deleteExam } from "@/utils/api";
import { useExams } from "@/hooks/useExams";
import { EditExamModal } from "./EditExamModal";

// Add Dialog import
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ExamListProps {
  onEditExam?: (exam: Exam) => void;
  onViewExam?: (exam: Exam) => void;
}

export const ExamList: React.FC<ExamListProps> = () => {
  const { exams, loading, error, refetch } = useExams();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Add state for delete confirmation modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setIsEditModalOpen(true);
  };

  const handleExamUpdated = () => {
    refetch();
    setEditingExam(null);
    setIsEditModalOpen(false);
  };

  // Open delete confirmation modal
  const handleDeleteExam = (exam: Exam) => {
    setExamToDelete(exam);
    setDeleteConfirmOpen(true);
  };

  // Confirm delete
  const confirmDeleteExam = async () => {
    if (!examToDelete) return;
    try {
      setDeletingId(examToDelete._id);
      await deleteExam(examToDelete._id);
      toast({
        title: "Exam deleted",
        description: "The exam has been successfully deleted.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error deleting exam",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
      setDeleteConfirmOpen(false);
      setExamToDelete(null);
    }
  };

  const handleDownloadQuestions = (exam: Exam) => {
    // Implement download logic here
    toast({
      title: "Download started",
      description: "Downloading exam questions...",
    });
  };

  if (loading) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Exam Management
            </CardTitle>
            <CardDescription>Loading exams...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="flex justify-between items-start mb-3">
                    <div className="h-6 bg-muted rounded w-1/3"></div>
                    <div className="h-6 bg-muted rounded w-20"></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="space-y-2">
                        <div className="h-4 bg-muted rounded w-16"></div>
                        <div className="h-4 bg-muted rounded w-24"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <EditExamModal
          exam={editingExam}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onExamUpdated={handleExamUpdated}
        />
      </>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center text-red-500">
            <p>Error loading exams: {error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Exam Management
          </CardTitle>
          <CardDescription>
            View and manage all your created exams and tests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exams.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Exams Found</h3>
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t created any exams yet. Create your first exam to get started.
                </p>
              </div>
            ) : (
              exams.map((exam) => (
                <div key={exam._id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {exam.subject?.name || 'Unknown Subject'} Examination
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Created by {exam.creator?.details?.firstName} {exam.creator?.details?.lastName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(exam.status)}>
                        {exam.status?.charAt(0).toUpperCase() + exam.status?.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Session:</span>
                      <span>{exam.session?.session || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Date:</span>
                      <span>{formatDate(exam.examDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Time:</span>
                      <span>{formatTime(exam.startTime)} - {formatTime(exam.endTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Venue:</span>
                      <span>{exam.venue || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Mode:</span>
                      <span className="capitalize">{exam.mode}</span>
                    </div>
                  </div>

                  {exam?.class && (
                    <div className="flex items-center gap-2 text-sm mb-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Class:</span>
                      <span>{exam?.class?.className}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{exam.students} students</span>
                      </div>
                    </div>
                    {exam?.status !== 'approve' && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditExam(exam)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="text-white"
                          onClick={() => handleDeleteExam(exam)}
                          disabled={deletingId === exam._id}
                        >
                          <Trash2 className="text-white bg-primaryColor h-4 w-4 mr-1" />
                          {deletingId === exam._id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <EditExamModal
              exam={editingExam}
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onExamUpdated={handleExamUpdated}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Exam</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-6 text-center text-lg">
              Are you sure you want to delete this exam?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="destructive"
                onClick={confirmDeleteExam}
                disabled={deletingId === examToDelete?._id}
              >
                Yes
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                No
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};