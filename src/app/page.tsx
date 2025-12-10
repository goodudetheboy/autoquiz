"use client";

import { useState, useEffect } from "react";
import { QuizCreationForm } from "@/components/quiz-creation-form";
import { QuizDisplay } from "@/components/quiz-display";
import { Button } from "@/components/ui/button";
import { History, Settings } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [quizResults, setQuizResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load quiz from localStorage if there's a lastOpenedQuizId
  useEffect(() => {
    const lastOpenedQuizId = localStorage.getItem("lastOpenedQuizId");
    if (lastOpenedQuizId) {
      const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
      const quiz = quizzes.find((q: any) => q.id === lastOpenedQuizId);
      if (quiz && quiz.results) {
        setQuizResults(quiz.results);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AutoQuiz
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-Powered Quiz Generation
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/history">
              <Button variant="outline" size="sm">
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <QuizCreationForm
              onQuizGenerated={setQuizResults}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
          <div className="lg:sticky lg:top-24 h-fit">
            <QuizDisplay results={quizResults} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}
