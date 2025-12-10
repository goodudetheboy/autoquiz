import { Note } from "./note";
import { Section } from "./section";

/**
 * Abstract class for sectioning strategy
 */
export abstract class SectioningStrategy {
  /**
   * Section note based on the desired number of sections
   */
  abstract process(note: Note): Section[];
}

/**
 * Class for basic sectioning strategy
 * Sends the entire note to the LLM in one go
 */
export class BasicSectioningStrategy extends SectioningStrategy {
  /**
   * For basic sectioning, return the entire note as a single section
   */
  process(note: Note): Section[] {
    return [new Section(note.content)];
  }
}

/**
 * Class for static sectioning strategy
 */
export class StaticSectioningStrategy extends SectioningStrategy {
  private numOfSection: number;

  constructor(numOfSection: number) {
    super();
    this.numOfSection = numOfSection;
  }

  /**
   * For static sectioning, simply section by number of lines to achieve
   * desired number of sections
   */
  process(note: Note): Section[] {
    // Remove trailing newlines
    const lines = note.content.split("\n").map((line) => line.trim());

    const numOfSection = this.numOfSection;
    const totalLines = lines.length;

    // Ensure at least 1 line per section
    const sectionSize = Math.max(1, Math.floor(totalLines / numOfSection));
    const sections: Section[] = [];

    for (let i = 0; i < numOfSection; i++) {
      const start = i * sectionSize;
      // Last section gets remaining lines
      const end = i < numOfSection - 1 ? (i + 1) * sectionSize : totalLines;
      const sectionText = lines.slice(start, end).join("\n");
      sections.push(new Section(sectionText));
    }

    return sections;
  }
}
