"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Sparkles, FileText } from "lucide-react";
import { toast } from "sonner";

interface QuizCreationFormProps {
  onQuizGenerated: (results: any[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function QuizCreationForm({
  onQuizGenerated,
  isLoading,
  setIsLoading,
}: QuizCreationFormProps) {
  const [noteContent, setNoteContent] = useState("");
  const [strategy, setStrategy] = useState("static");
  const [numSections, setNumSections] = useState(3);
  const [numQuizPerSection, setNumQuizPerSection] = useState(5);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  // Stats
  const charCount = noteContent.length;
  const wordCount = noteContent.trim() ? noteContent.trim().split(/\s+/).length : 0;
  const lineCount = noteContent.split("\n").length;

  const handleGenerate = async () => {
    if (strategy !== "debug" && !noteContent.trim()) {
      toast.error("Please enter some notes before generating a quiz");
      return;
    }

    // Check if API key is configured (only for non-debug mode)
    if (strategy !== "debug") {
      const apiKey = localStorage.getItem("openai_api_key");
      if (!apiKey) {
        toast.error("Please configure your OpenAI API key in Settings");
        return;
      }
    }

    setIsLoading(true);
    setProgress(0);

    const progressSteps = [
      "Preparing your note for processing...",
      "Analyzing the sections based on your chosen strategy...",
      "Segmenting the content into manageable sections...",
      "Identifying key concepts for quiz generation...",
      "Creating questions from the sections...",
      "Finalizing your quiz...",
    ];

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 2;
      });

      const stepIndex = Math.floor((currentStep / 90) * progressSteps.length);
      if (stepIndex < progressSteps.length) {
        setProgressText(progressSteps[stepIndex]);
      }
      currentStep += 2;
    }, 1000);

    try {
      // Get API key and model from localStorage
      const apiKey = localStorage.getItem("openai_api_key") || "";
      const model = localStorage.getItem("openai_model") || "gpt-5-mini-2025-08-07";

      const requestBody =
        strategy === "debug"
          ? { debug_mode: true }
          : {
              note_content: noteContent,
              sectioning_strategy: "static_sectioning",
              num_section: numSections,
              num_quiz_per_section: numQuizPerSection,
              api_key: apiKey,
              model: model,
            };

      const response = await fetch("/api/quiz/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz");
      }

      const data = await response.json();

      if (!data.results) {
        throw new Error("No quiz results found in response");
      }

      clearInterval(progressInterval);
      setProgress(100);
      setProgressText("Completed!");

      onQuizGenerated(data.results);

      // Save to localStorage
      const quizId = Date.now().toString();
      const savedQuizzes = JSON.parse(
        localStorage.getItem("quizzes") || "[]"
      );
      savedQuizzes.push({
        id: quizId,
        name: "Untitled Quiz",
        results: data.results,
        createdAt: Date.now(),
      });
      localStorage.setItem("quizzes", JSON.stringify(savedQuizzes));
      localStorage.setItem("lastOpenedQuizId", quizId);

      toast.success(`Quiz generated successfully! ${data.results.length} questions created.`);
    } catch (error) {
      console.error(error);
      clearInterval(progressInterval);
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setProgress(0);
        setProgressText("");
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              placeholder="Paste your study notes here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="min-h-[200px] resize-y"
              disabled={isLoading}
            />
          </div>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold">Stats</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Characters: </span>
                <span className="font-medium">{charCount}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Words: </span>
                <span className="font-medium">{wordCount}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Lines: </span>
                <span className="font-medium">{lineCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strategy">Sectioning Strategy</Label>
            <Select value={strategy} onValueChange={setStrategy} disabled={isLoading}>
              <SelectTrigger id="strategy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">Static Sectioning</SelectItem>
                <SelectItem value="debug">DEBUG MODE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {strategy === "static" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="sections">
                  Total Sections
                  <span className="text-xs text-muted-foreground ml-2">
                    (1-10)
                  </span>
                </Label>
                <Input
                  id="sections"
                  type="number"
                  min={1}
                  max={10}
                  value={numSections}
                  onChange={(e) => setNumSections(parseInt(e.target.value) || 1)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quizzes">
                  Quizzes per Section
                  <span className="text-xs text-muted-foreground ml-2">
                    (1-10)
                  </span>
                </Label>
                <Input
                  id="quizzes"
                  type="number"
                  min={1}
                  max={10}
                  value={numQuizPerSection}
                  onChange={(e) =>
                    setNumQuizPerSection(parseInt(e.target.value) || 1)
                  }
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>Generating Quiz...</>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Quiz
              </>
            )}
          </Button>

          {isLoading && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {progressText}
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
