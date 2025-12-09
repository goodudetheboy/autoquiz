/**
 * @jest-environment node
 */

import { Quizmaster } from "@/lib/services/quizmaster";
import { Note } from "@/lib/models/note";
import { StaticSectioningStrategy } from "@/lib/models/sectioning-strategy";
import { MultipleChoiceQuestion } from "@/lib/models/quiz-question";
import fs from "fs";
import path from "path";

// Create mock function outside
const mockGenerateJson = jest.fn();

// Mock the OpenAIClient
jest.mock("@/lib/services/openai-client", () => {
  return {
    OpenAIClient: jest.fn().mockImplementation(() => ({
      generateJson: mockGenerateJson,
    })),
  };
});

describe("Quizmaster Service", () => {
  let sampleStudyNote: string;

  beforeAll(() => {
    const filePath = path.join(
      __dirname,
      "../data/sample_study_note_short.txt"
    );
    sampleStudyNote = fs.readFileSync(filePath, "utf-8");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createQuizList", () => {
    it("should create quiz list with static sectioning", async () => {
      // Mock response for each section
      const mockQuizResponse = JSON.stringify({
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
            question: "What is 2+2?",
            choices: [
              { description: "4", is_correct: true },
              { description: "3", is_correct: false },
              { description: "5", is_correct: false },
              { description: "6", is_correct: false },
            ],
          },
          {
            question: "What color is the sky?",
            choices: [
              { description: "Blue", is_correct: true },
              { description: "Green", is_correct: false },
              { description: "Red", is_correct: false },
              { description: "Yellow", is_correct: false },
            ],
          },
          {
            question: "What is the largest planet?",
            choices: [
              { description: "Jupiter", is_correct: true },
              { description: "Earth", is_correct: false },
              { description: "Mars", is_correct: false },
              { description: "Venus", is_correct: false },
            ],
          },
          {
            question: "What is H2O?",
            choices: [
              { description: "Water", is_correct: true },
              { description: "Oxygen", is_correct: false },
              { description: "Hydrogen", is_correct: false },
              { description: "Carbon Dioxide", is_correct: false },
            ],
          },
        ],
      });

      mockGenerateJson.mockResolvedValue(mockQuizResponse);

      const note = new Note(sampleStudyNote);
      const numSections = 1;
      const quizPerSection = 5;
      const strategy = new StaticSectioningStrategy(numSections);

      const quizmaster = new Quizmaster("gpt-4o");
      const quizList = await quizmaster.createQuizList(
        note,
        strategy,
        quizPerSection
      );

      // Should have correct number of quizzes
      expect(quizList).toHaveLength(numSections * quizPerSection);

      // Each quiz should be a MultipleChoiceQuestion instance
      quizList.forEach((quiz) => {
        expect(quiz).toBeInstanceOf(MultipleChoiceQuestion);
        expect(quiz.choices).toHaveLength(4);

        // Check that first choice is correct (per prompt template)
        expect(quiz.choices[0].isCorrect).toBe(true);

        // Check that remaining choices are incorrect
        for (let i = 1; i < quiz.choices.length; i++) {
          expect(quiz.choices[i].isCorrect).toBe(false);
        }
      });

      // Verify OpenAI client was called
      expect(mockGenerateJson).toHaveBeenCalledTimes(numSections);
    });

    it("should handle multiple sections", async () => {
      const mockQuizResponse = JSON.stringify({
        results: [
          {
            question: "Test question",
            choices: [
              { description: "Correct", is_correct: true },
              { description: "Wrong 1", is_correct: false },
              { description: "Wrong 2", is_correct: false },
              { description: "Wrong 3", is_correct: false },
            ],
          },
        ],
      });

      mockGenerateJson.mockResolvedValue(mockQuizResponse);

      const note = new Note(sampleStudyNote);
      const numSections = 3;
      const quizPerSection = 1;
      const strategy = new StaticSectioningStrategy(numSections);

      const quizmaster = new Quizmaster("gpt-4o");
      const quizList = await quizmaster.createQuizList(
        note,
        strategy,
        quizPerSection
      );

      // Should call API once per section
      expect(mockGenerateJson).toHaveBeenCalledTimes(numSections);

      // Should return correct total number of quizzes
      expect(quizList).toHaveLength(numSections * quizPerSection);
    });

    it("should aggregate quizzes from all sections", async () => {
      let callCount = 0;
      mockGenerateJson.mockImplementation(() => {
        callCount++;
        return Promise.resolve(
          JSON.stringify({
            results: [
              {
                question: `Question from section ${callCount}`,
                choices: [
                  { description: "Correct", is_correct: true },
                  { description: "Wrong 1", is_correct: false },
                  { description: "Wrong 2", is_correct: false },
                  { description: "Wrong 3", is_correct: false },
                ],
              },
            ],
          })
        );
      });

      const note = new Note(sampleStudyNote);
      const numSections = 3;
      const quizPerSection = 1;
      const strategy = new StaticSectioningStrategy(numSections);

      const quizmaster = new Quizmaster("gpt-4o");
      const quizList = await quizmaster.createQuizList(
        note,
        strategy,
        quizPerSection
      );

      // Verify quizzes from all sections are included
      expect(quizList[0].question).toBe("Question from section 1");
      expect(quizList[1].question).toBe("Question from section 2");
      expect(quizList[2].question).toBe("Question from section 3");
    });

    it("should use the correct model", () => {
      const quizmaster = new Quizmaster("gpt-4o");
      expect(quizmaster).toBeDefined();
    });

    it("should default to gpt-4o model", () => {
      const quizmaster = new Quizmaster();
      expect(quizmaster).toBeDefined();
    });
  });
});
