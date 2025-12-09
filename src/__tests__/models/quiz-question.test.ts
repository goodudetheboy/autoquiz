import {
  MultipleChoiceQuestion,
  Choice,
} from "@/lib/models/quiz-question";
import fs from "fs";
import path from "path";

describe("MultipleChoiceQuestion Model", () => {
  let sampleMCQs: any[];

  beforeAll(() => {
    // Read sample MCQs from test data
    const filePath = path.join(
      __dirname,
      "../data/sample_multiple_choice_questions.json"
    );
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    sampleMCQs = data.results;
  });

  describe("Choice class", () => {
    it("should create a choice with description and correctness", () => {
      const choice = new Choice("Test answer", true);
      expect(choice.description).toBe("Test answer");
      expect(choice.isCorrect).toBe(true);
    });

    it("should export to JSON", () => {
      const choice = new Choice("Test answer", false);
      const json = choice.exportJson();
      expect(json).toEqual({
        description: "Test answer",
        is_correct: false,
      });
    });

    it("should create from JSON", () => {
      const json = { description: "Test answer", is_correct: true };
      const choice = Choice.fromJson(json);
      expect(choice.description).toBe("Test answer");
      expect(choice.isCorrect).toBe(true);
    });
  });

  describe("MultipleChoiceQuestion class", () => {
    it("should create a question with constructor", () => {
      const singleMCQ = sampleMCQs[0];
      const choices = singleMCQ.choices.map(
        (c: any) => new Choice(c.description, c.is_correct)
      );
      const question = new MultipleChoiceQuestion(singleMCQ.question, choices);

      expect(question.question).toBe(singleMCQ.question);
      expect(question.choices).toHaveLength(singleMCQ.choices.length);

      question.choices.forEach((choice, i) => {
        expect(choice.description).toBe(singleMCQ.choices[i].description);
        expect(choice.isCorrect).toBe(singleMCQ.choices[i].is_correct);
      });
    });

    it("should create from JSON", () => {
      const singleMCQ = sampleMCQs[0];
      const question = MultipleChoiceQuestion.fromJson(singleMCQ);

      expect(question.question).toBe(singleMCQ.question);
      expect(question.choices).toHaveLength(singleMCQ.choices.length);

      question.choices.forEach((choice, i) => {
        expect(choice.description).toBe(singleMCQ.choices[i].description);
        expect(choice.isCorrect).toBe(singleMCQ.choices[i].is_correct);
      });
    });

    it("should create multiple questions from JSON list", () => {
      const questions = MultipleChoiceQuestion.fromJsonList(sampleMCQs);

      expect(questions).toHaveLength(sampleMCQs.length);

      questions.forEach((question, i) => {
        const singleMCQ = sampleMCQs[i];
        expect(question.question).toBe(singleMCQ.question);
        expect(question.choices).toHaveLength(singleMCQ.choices.length);

        question.choices.forEach((choice, j) => {
          expect(choice.description).toBe(singleMCQ.choices[j].description);
          expect(choice.isCorrect).toBe(singleMCQ.choices[j].is_correct);
        });
      });
    });

    it("should export to JSON", () => {
      const question = MultipleChoiceQuestion.fromJson(sampleMCQs[0]);
      const json = question.exportJson();

      expect(json).toEqual(sampleMCQs[0]);
    });

    it("should handle questions with exactly 4 choices", () => {
      const singleMCQ = sampleMCQs[0];
      const question = MultipleChoiceQuestion.fromJson(singleMCQ);
      expect(question.choices).toHaveLength(4);
    });

    it("should have exactly one correct answer", () => {
      const question = MultipleChoiceQuestion.fromJson(sampleMCQs[0]);
      const correctChoices = question.choices.filter((c) => c.isCorrect);
      expect(correctChoices).toHaveLength(1);
    });
  });
});
