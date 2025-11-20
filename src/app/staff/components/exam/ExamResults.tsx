import { CheckCircle, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ExamResults = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Exam Results
        </CardTitle>
        <CardDescription>View student performance and exam analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Results Available</h3>
          <p className="text-muted-foreground mb-4">
            Results will appear here once students complete their exams
          </p>
          <Button variant="outline">View Past Results</Button>
        </div>
      </CardContent>
    </Card>
  );
};
