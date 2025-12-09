import { Section } from "@/lib/models/section";

describe("Section Model", () => {
  describe("constructor", () => {
    it("should create a section from plaintext", () => {
      const content = "This is a section of a note.";
      const section = new Section(content);
      expect(section.content).toBe(content);
    });

    it("should handle empty string", () => {
      const section = new Section("");
      expect(section.content).toBe("");
    });

    it("should preserve formatting", () => {
      const content = "Line 1\nLine 2\nLine 3";
      const section = new Section(content);
      expect(section.content).toBe(content);
    });
  });
});
