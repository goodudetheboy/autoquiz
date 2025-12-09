"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Trash2,
  FileJson,
  Calendar,
  FileQuestion,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Quiz {
  id: string;
  name: string;
  results: any[];
  createdAt: number;
}

export default function HistoryPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = () => {
    const saved = localStorage.getItem("quizzes");
    if (saved) {
      const parsed = JSON.parse(saved);
      setQuizzes(parsed.sort((a: Quiz, b: Quiz) => b.createdAt - a.createdAt));
    }
  };

  const handleDelete = (id: string) => {
    const filtered = quizzes.filter((q) => q.id !== id);
    setQuizzes(filtered);
    localStorage.setItem("quizzes", JSON.stringify(filtered));

    const lastId = localStorage.getItem("lastOpenedQuizId");
    if (lastId === id) {
      localStorage.removeItem("lastOpenedQuizId");
    }

    toast.success("Quiz deleted!");
  };

  const handleOpen = (id: string) => {
    localStorage.setItem("lastOpenedQuizId", id);
    router.push("/");
  };

  const handleExport = (quiz: Quiz) => {
    const json = JSON.stringify(quiz.results, null, 2);
    navigator.clipboard.writeText(json);
    toast.success("Quiz JSON copied to clipboard!");
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Quiz History
              </h1>
              <p className="text-sm text-muted-foreground">
                View and manage your saved quizzes
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Saved Quizzes ({quizzes.length})</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredQuizzes.length === 0 ? (
              <div className="text-center py-12">
                <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No quizzes found matching your search"
                    : "No quizzes saved yet"}
                </p>
                {!searchQuery && (
                  <Link href="/">
                    <Button className="mt-4">Create Your First Quiz</Button>
                  </Link>
                )}
              </div>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {filteredQuizzes.map((quiz) => (
                    <Card
                      key={quiz.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleOpen(quiz.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-lg">
                              {quiz.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(quiz.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <FileQuestion className="h-4 w-4" />
                                {quiz.results.length} questions
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExport(quiz);
                              }}
                            >
                              <FileJson className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(quiz.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
