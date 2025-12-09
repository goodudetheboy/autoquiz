import {
  StaticSectioningStrategy,
  SectioningStrategy,
} from "@/lib/models/sectioning-strategy";
import { Note } from "@/lib/models/note";
import { Section } from "@/lib/models/section";
import fs from "fs";
import path from "path";

describe("SectioningStrategy Models", () => {
  let sampleStudyNote: string;
  let expectedSections: Section[];

  beforeAll(() => {
    // Read sample study note
    const notePath = path.join(__dirname, "../data/sample_study_note.txt");
    sampleStudyNote = fs.readFileSync(notePath, "utf-8");

    // Read expected sections
    const sectionsPath = path.join(
      __dirname,
      "../data/sample_static_sectioning_by_num_of_section.json"
    );
    const sectionTexts = JSON.parse(fs.readFileSync(sectionsPath, "utf-8"));
    expectedSections = sectionTexts.map((text: string) => new Section(text));
  });

  describe("StaticSectioningStrategy", () => {
    it("should divide note into correct number of sections", () => {
      const note = new Note(sampleStudyNote);
      const numSections = 10;
      const strategy = new StaticSectioningStrategy(numSections);

      const sections = strategy.process(note);

      expect(sections).toHaveLength(expectedSections.length);
      expect(sections).toHaveLength(numSections);
    });

    it("should match expected section content", () => {
      const note = new Note(sampleStudyNote);
      const numSections = 10;
      const strategy = new StaticSectioningStrategy(numSections);

      const sections = strategy.process(note);

      sections.forEach((section, i) => {
        expect(section.content).toBe(expectedSections[i].content);
      });
    });

    it("should handle single section", () => {
      const note = new Note(sampleStudyNote);
      const strategy = new StaticSectioningStrategy(1);

      const sections = strategy.process(note);

      expect(sections).toHaveLength(1);
      // Should contain all lines (trimmed)
      const trimmedLines = sampleStudyNote
        .split("\n")
        .map((line) => line.trim());
      expect(sections[0].content).toBe(trimmedLines.join("\n"));
    });

    it("should handle empty note", () => {
      const note = new Note("");
      const strategy = new StaticSectioningStrategy(5);

      const sections = strategy.process(note);

      expect(sections).toHaveLength(5);
      sections.forEach((section) => {
        expect(section.content).toBe("");
      });
    });

    it("should distribute lines evenly across sections", () => {
      const note = new Note("Line1\nLine2\nLine3\nLine4\nLine5\nLine6");
      const strategy = new StaticSectioningStrategy(3);

      const sections = strategy.process(note);

      expect(sections).toHaveLength(3);
      expect(sections[0].content).toBe("Line1\nLine2");
      expect(sections[1].content).toBe("Line3\nLine4");
      expect(sections[2].content).toBe("Line5\nLine6");
    });

    it("should handle last section getting remaining lines", () => {
      const note = new Note("Line1\nLine2\nLine3\nLine4\nLine5");
      const strategy = new StaticSectioningStrategy(2);

      const sections = strategy.process(note);

      expect(sections).toHaveLength(2);
      expect(sections[0].content).toBe("Line1\nLine2");
      // Last section gets remaining 3 lines
      expect(sections[1].content).toBe("Line3\nLine4\nLine5");
    });

    it("should ensure at least 1 line per section", () => {
      const note = new Note("Single line");
      const strategy = new StaticSectioningStrategy(5);

      const sections = strategy.process(note);

      expect(sections).toHaveLength(5);
      // First section gets the line, others are empty
      expect(sections[0].content).toBe("Single line");
    });

    it("should extend SectioningStrategy", () => {
      const strategy = new StaticSectioningStrategy(5);
      expect(strategy).toBeInstanceOf(SectioningStrategy);
    });
  });
});
