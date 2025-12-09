"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  Trash2,
  FileJson,
  Shuffle,
  Check,
  X,
  Loader2,
  Pencil,
  Eye,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Choice {
  description: string;
  is_correct: boolean;
}

interface Question {
  question: string;
  choices: Choice[];
}

interface QuizDisplayProps {
  results: Question[] | null;
  isLoading: boolean;
}

export function QuizDisplay({ results, isLoading }: QuizDisplayProps) {
  const [quizName, setQuizName] = useState("Untitled Quiz");
  const [quizId, setQuizId] = useState<string | null>(null);
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [revealedAnswers, setRevealedAnswers] = useState<{
    [key: number]: boolean;
  }>({});
  const [isEditingName, setIsEditingName] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");

  useEffect(() => {
    if (results) {
      setDisplayedQuestions(shuffleArray([...results]));
      setSelectedAnswers({});
      setRevealedAnswers({});

      // Get quiz ID from localStorage
      const id = localStorage.getItem("lastOpenedQuizId");
      if (id) {
        setQuizId(id);
        const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
        const quiz = quizzes.find((q: any) => q.id === id);
        if (quiz) {
          setQuizName(quiz.name);
        }
      }
    }
  }, [results]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleShuffle = () => {
    setDisplayedQuestions(shuffleArray([...displayedQuestions]));
    setSelectedAnswers({});
    setRevealedAnswers({});
    toast.success("Quiz shuffled!");
  };

  const handleSave = () => {
    if (!quizId || !results) return;

    const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const index = quizzes.findIndex((q: any) => q.id === quizId);
    if (index !== -1) {
      quizzes[index].name = quizName;
      quizzes[index].results = results;
      localStorage.setItem("quizzes", JSON.stringify(quizzes));
      toast.success("Quiz saved!");
    }
  };

  const handleDelete = () => {
    if (!quizId) return;

    const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const filtered = quizzes.filter((q: any) => q.id !== quizId);
    localStorage.setItem("quizzes", JSON.stringify(filtered));
    localStorage.removeItem("lastOpenedQuizId");
    setQuizId(null);
    setDisplayedQuestions([]);
    toast.success("Quiz deleted!");
  };

  const handleExport = () => {
    if (!results) return;
    const json = JSON.stringify(results, null, 2);
    navigator.clipboard.writeText(json);
    toast.success("Quiz JSON copied to clipboard!");
  };

  const handleAnswerSelect = (questionIndex: number, choiceIndex: number) => {
    if (revealedAnswers[questionIndex]) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: choiceIndex,
    }));
    setRevealedAnswers((prev) => ({
      ...prev,
      [questionIndex]: true,
    }));
  };

  const getScore = () => {
    let correct = 0;
    Object.entries(selectedAnswers).forEach(([qIndex, cIndex]) => {
      if (displayedQuestions[parseInt(qIndex)].choices[cIndex].is_correct) {
        correct++;
      }
    });
    return { correct, total: displayedQuestions.length };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">
              Generating your quiz...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <Eye className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Your generated quiz will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { correct, total } = getScore();
  const scorePercentage =
    Object.keys(selectedAnswers).length > 0
      ? Math.round((correct / Object.keys(selectedAnswers).length) * 100)
      : 0;

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <Input
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditingName(false);
                }}
                autoFocus
                className="text-lg font-semibold"
              />
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <CardTitle>{quizName}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingName(true)}
                  className="h-6 w-6"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <FileJson className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleShuffle}>
              <Shuffle className="h-4 w-4 mr-2" />
              Shuffle
            </Button>
          </div>

          {Object.keys(selectedAnswers).length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Progress:</span>
                  <span className="font-medium">
                    {Object.keys(selectedAnswers).length} / {total}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Score:</span>
                  <span className="font-medium">
                    {correct} / {Object.keys(selectedAnswers).length} (
                    {scorePercentage}%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="preview" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex-1">
              <PlayCircle className="h-4 w-4 mr-2" />
              Practice
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {displayedQuestions.map((q, qIndex) => (
                  <div key={qIndex} className="space-y-3">
                    <div className="font-medium">
                      {qIndex + 1}. {q.question}
                    </div>
                    <div className="space-y-2 pl-4">
                      {q.choices.map((choice, cIndex) => (
                        <div
                          key={cIndex}
                          className={`text-sm p-2 rounded-md ${
                            choice.is_correct
                              ? "bg-green-100 dark:bg-green-900/20 text-green-900 dark:text-green-100"
                              : "bg-muted"
                          }`}
                        >
                          {choice.is_correct && (
                            <Check className="h-4 w-4 inline mr-2" />
                          )}
                          {choice.description}
                        </div>
                      ))}
                    </div>
                    {qIndex < displayedQuestions.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="practice" className="mt-4">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {displayedQuestions.map((q, qIndex) => (
                  <div key={qIndex} className="space-y-3">
                    <div className="font-medium">
                      {qIndex + 1}. {q.question}
                    </div>
                    <div className="space-y-2 pl-4">
                      {shuffleArray(
                        q.choices.map((c, i) => ({ ...c, originalIndex: i }))
                      ).map((choice, displayIndex) => {
                        const isSelected =
                          selectedAnswers[qIndex] === choice.originalIndex;
                        const isRevealed = revealedAnswers[qIndex];
                        const isCorrect = choice.is_correct;

                        return (
                          <button
                            key={displayIndex}
                            onClick={() =>
                              handleAnswerSelect(qIndex, choice.originalIndex)
                            }
                            disabled={isRevealed}
                            className={`text-sm p-3 rounded-md w-full text-left transition-colors ${
                              !isRevealed
                                ? "hover:bg-accent cursor-pointer"
                                : "cursor-not-allowed"
                            } ${
                              isSelected && isRevealed && isCorrect
                                ? "bg-green-100 dark:bg-green-900/20 text-green-900 dark:text-green-100"
                                : isSelected && isRevealed && !isCorrect
                                ? "bg-red-100 dark:bg-red-900/20 text-red-900 dark:text-red-100"
                                : isRevealed && isCorrect
                                ? "bg-green-50 dark:bg-green-900/10 text-green-900 dark:text-green-100"
                                : "bg-muted"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isSelected && isRevealed && isCorrect && (
                                <Check className="h-4 w-4 flex-shrink-0" />
                              )}
                              {isSelected && isRevealed && !isCorrect && (
                                <X className="h-4 w-4 flex-shrink-0" />
                              )}
                              {!isSelected && isRevealed && isCorrect && (
                                <Check className="h-4 w-4 flex-shrink-0 text-green-600" />
                              )}
                              <span>{choice.description}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {qIndex < displayedQuestions.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
