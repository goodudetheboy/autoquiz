import { createQuiz } from "../../../static/scripts/common/quiz.js";
import fs from "fs"; // Node"s File System module
import { jest } from "@jest/globals"

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
