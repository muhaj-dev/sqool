
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { 
  FileEdit, 
  FileText,

} from "lucide-react";



// Individual Question Builder Component (Commented out with Coming Soon message)
export const QuestionBuilder = () => {
  /*
  // TODO: Uncomment and implement when individual question builder is ready
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
    difficulty: "medium"
  });
  const { toast } = useToast();

  const addQuestion = () => {
    if (currentQuestion.question.trim()) {
      setQuestions([...questions, { ...currentQuestion, id: Date.now() }]);
      setCurrentQuestion({
        type: "multiple-choice",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        points: 1,
        difficulty: "medium"
      });
      toast({
        title: "Question added",
        description: "Question has been added to your collection.",
      });
    }
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Question Type,Question,Option A,Option B,Option C,Option D,Correct Answer,Points,Difficulty\n"
      + "multiple-choice,Sample Question?,Option 1,Option 2,Option 3,Option 4,A,2,medium\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exam_questions_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  */

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileEdit className="h-5 w-5" />
          Individual Question Builder
        </CardTitle>
        <CardDescription>
          Create questions one by one for practice or additional content
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Coming Soon Message */}
        <div className="text-center py-12">
          <div className="bg-muted/50 rounded-lg p-8 max-w-md mx-auto">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground mb-4">
              The individual question builder feature is currently under development.
            </p>
            <p className="text-sm text-muted-foreground">
              Please use the file upload method above to create examinations for now.
            </p>
          </div>
        </div>

        {/*
        // TODO: Uncomment when individual question builder is ready
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Question Form * /}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Question Type</Label>
                  <Select value={currentQuestion.type} onValueChange={(value) => setCurrentQuestion({...currentQuestion, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="short-answer">Short Answer</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter your question here..."
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>

                {currentQuestion.type === "multiple-choice" && (
                  <div className="space-y-4">
                    <Label>Answer Options</Label>
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options];
                            newOptions[index] = e.target.value;
                            setCurrentQuestion({...currentQuestion, options: newOptions});
                          }}
                        />
                      </div>
                    ))}
                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <Select value={currentQuestion.correctAnswer} onValueChange={(value) => setCurrentQuestion({...currentQuestion, correctAnswer: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentQuestion.options.map((option, index) => (
                            option && (
                              <SelectItem key={index} value={String.fromCharCode(65 + index)}>
                                {String.fromCharCode(65 + index)} - {option}
                              </SelectItem>
                            )
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      value={currentQuestion.points}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, points: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={currentQuestion.difficulty} onValueChange={(value) => setCurrentQuestion({...currentQuestion, difficulty: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={addQuestion} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </div>

            {/* Question Preview * /}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Questions Added ({questions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {questions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No questions added yet</p>
                  ) : (
                    <div className="space-y-4">
                      {questions.map((q, index) => (
                        <div key={q.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium">Q{index + 1}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(q.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm mb-2">{q.question}</p>
                          <div className="flex gap-2">
                            <Badge variant="secondary">{q.type}</Badge>
                            <Badge variant="outline">{q.points} pts</Badge>
                          </div>
                        </div>
                      ))}
                      <Separator />
                      <div className="space-y-2">
                        <Button className="w-full" disabled={questions.length === 0}>
                          Save Question Bank
                        </Button>
                        <Button variant="outline" onClick={downloadTemplate} className="w-full gap-2">
                          <Download className="h-4 w-4" />
                          Download as Template
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        */}
      </CardContent>
    </Card>
  );
};