import { NextRequest, NextResponse } from "next/server";
import { Note } from "@/lib/models/note";
import { StaticSectioningStrategy } from "@/lib/models/sectioning-strategy";
import { Quizmaster } from "@/lib/services/quizmaster";

export async function POST(request: NextRequest) {
  try {
    const jsonData = await request.json();

    // Debug mode - return sample questions
    if (jsonData.debug_mode) {
      const sampleQuestions = {
        results: [
          {
            question: "What is the capital of France?",
            choices: [
              { description: "Paris", is_correct: true },
              { description: "London", is_correct: false },
              { description: "Berlin", is_correct: false },
              { description: "Madrid", is_correct: false },
            ],
          },
          {
            question: "What is 2 + 2?",
            choices: [
              { description: "4", is_correct: true },
              { description: "3", is_correct: false },
              { description: "5", is_correct: false },
              { description: "6", is_correct: false },
            ],
          },
          {
            question: "Which planet is known as the Red Planet?",
            choices: [
              { description: "Mars", is_correct: true },
              { description: "Venus", is_correct: false },
              { description: "Jupiter", is_correct: false },
              { description: "Saturn", is_correct: false },
            ],
          },
          {
            question: "What is the largest ocean on Earth?",
            choices: [
              { description: "Pacific Ocean", is_correct: true },
              { description: "Atlantic Ocean", is_correct: false },
              { description: "Indian Ocean", is_correct: false },
              { description: "Arctic Ocean", is_correct: false },
            ],
          },
          {
            question: "Who wrote 'Romeo and Juliet'?",
            choices: [
              { description: "William Shakespeare", is_correct: true },
              { description: "Charles Dickens", is_correct: false },
              { description: "Jane Austen", is_correct: false },
              { description: "Mark Twain", is_correct: false },
            ],
          },
        ],
      };
      return NextResponse.json(sampleQuestions, { status: 200 });
    }

    // Validate required fields
    if (
      !jsonData.note_content ||
      !jsonData.sectioning_strategy ||
      !jsonData.num_section ||
      !jsonData.num_quiz_per_section
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate API key is provided
    if (!jsonData.api_key) {
      return NextResponse.json(
        { error: "OpenAI API key is required. Please configure it in Settings." },
        { status: 400 }
      );
    }

    const noteContent = jsonData.note_content as string;
    const sectioningStrategy = jsonData.sectioning_strategy as string;
    const numSection = parseInt(jsonData.num_section);
    const numQuizPerSection = parseInt(jsonData.num_quiz_per_section);
    const apiKey = jsonData.api_key as string;
    const model = jsonData.model || "gpt-5-mini-2025-08-07";

    const quizmaster = new Quizmaster(model, apiKey);
    const note = new Note(noteContent);

    let strategy;
    if (sectioningStrategy === "static_sectioning") {
      strategy = new StaticSectioningStrategy(numSection);
    } else {
      return NextResponse.json(
        { error: "Invalid sectioning strategy" },
        { status: 400 }
      );
    }

    const quizList = await quizmaster.createQuizList(
      note,
      strategy,
      numQuizPerSection
    );

    const jsonQuizList = quizList.map((quiz) => quiz.exportJson());

    return NextResponse.json({ results: jsonQuizList }, { status: 200 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
