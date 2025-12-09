import { Note } from "@/lib/models/note";
import fs from "fs";
import path from "path";

describe("Note Model", () => {
  let sampleStudyNote: string;

  beforeAll(() => {
    // Read sample study note from test data
    const filePath = path.join(__dirname, "../data/sample_study_note.txt");
    sampleStudyNote = fs.readFileSync(filePath, "utf-8");
  });

  describe("constructor", () => {
    it("should create a note from plaintext", () => {
      const note = new Note(sampleStudyNote);
      expect(note.content).toBe(sampleStudyNote);
    });

    it("should handle empty string", () => {
      const note = new Note("");
      expect(note.content).toBe("");
    });

    it("should preserve whitespace and formatting", () => {
      const textWithFormatting = "  Line 1\n\n  Line 2  \n";
      const note = new Note(textWithFormatting);
      expect(note.content).toBe(textWithFormatting);
    });
  });
});
