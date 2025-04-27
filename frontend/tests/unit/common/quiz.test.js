import { createQuiz, saveQuiz, getQuiz, getQuizHistory, deleteQuiz, clearQuizzes  } from "../../../static/scripts/common/quiz.js";
import fs from "fs";
import { jest } from "@jest/globals"

// Mock localStorage
global.localStorage = {
    store: {},
    getItem: function (key) { return this.store[key] || null; },
    setItem: function (key, value) { this.store[key] = value.toString(); },
    removeItem: function (key) { delete this.store[key]; },
    clear: function () { this.store = {}; }
};

describe("create_quiz", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return JSON data from the file when fetch is successful", async () => {
    // Read the JSON file content
    const mockJson = JSON.parse(fs.readFileSync("../api/data/debug_mode_multiple_choice_questions.json", "utf-8"));

    // Arrange: Mock the fetch response to return the JSON content from the file
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockJson),
    });

    // Act: Call the create_quiz function
    const requestBody = {}; // Add appropriate request body if needed
    const result = await createQuiz(requestBody);

    // Assert: Verify the expected result
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockJson); // Ensure the returned value matches the mock JSON data
  });

  it("should throw an error when fetch fails", async () => {
    // Mock a failed response
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: "Internal Server Error" }),
    });

    const requestBody = {}; // Add appropriate request body if needed
    await expect(createQuiz(requestBody)).rejects.toThrow("HTTP error! Status: 500");
  });
});


describe("Quiz Storage Functions", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("should save a quiz and add it to history", () => {
        const quizData = { questions: ["Q1", "Q2"], answers: ["A1", "A2"] };
        const quizId = saveQuiz("Math Quiz", quizData);

        expect(quizId).toBeDefined();
        expect(getQuizHistory().length).toBe(1);
        expect(getQuiz(quizId)).toMatchObject({ name: "Math Quiz", results: quizData });
    });

    test("should retrieve a saved quiz", () => {
        const quizData = { questions: ["Q1"], answers: ["A1"] };
        const quizId = saveQuiz("Science Quiz", quizData);

        const retrievedQuiz = getQuiz(quizId);
        expect(retrievedQuiz).toMatchObject({ name: "Science Quiz", results: quizData });
    });

    test("should return null for nonexistent quiz", () => {
        expect(getQuiz("nonexistent-id")).toBeNull();
    });

    test("should retrieve quiz history", () => {
        saveQuiz("Quiz 1", {});
        saveQuiz("Quiz 2", {});

        const history = getQuizHistory();
        expect(history.length).toBe(2);
        expect(history[0]).toHaveProperty("quizId");
    });

    test("should delete a quiz and remove it from history", () => {
        const quizId = saveQuiz("History Quiz", {});
        expect(deleteQuiz(quizId)).toBe(true);
        expect(getQuiz(quizId)).toBeNull();
        expect(getQuizHistory().length).toBe(0);
    });

    test("should return false when deleting a non-existing quiz", () => {
        expect(deleteQuiz("invalid-id")).toBe(false);
    });

    test("should clear all quizzes and history", () => {
        saveQuiz("Quiz A", {});
        saveQuiz("Quiz B", {});
        clearQuizzes();
        expect(getQuizHistory().length).toBe(0);
    });

    test("should update an existing quiz", () => {
        const quizData = { results: { questions: ["Q1"], answers: ["A1"] } };
        const quizId = saveQuiz("Initial Quiz", quizData);

        const updatedData = { results: { questions: ["Q1", "Q2"], answers: ["A1", "A2"] } };
        const updatedQuizId = updateQuiz(quizId, "Updated Quiz", updatedData);

        expect(updatedQuizId).toBe(quizId); // Same quiz ID
        expect(getQuiz(quizId)).toMatchObject({ name: "Updated Quiz", results: updatedData.results });

        const history = getQuizHistory();
        expect(history.length).toBe(1); // No new entry
        expect(history[0].name).toBe("Updated Quiz"); // History reflects the update
    });

    test("should create a new quiz if quizId doesn't exist", () => {
        const newQuizId = updateQuiz("nonexistent-id", "New Quiz", { results: {} });

        expect(getQuiz(newQuizId)).toMatchObject({ name: "New Quiz", results: {} });
        expect(getQuizHistory().length).toBe(1);
    });
});
