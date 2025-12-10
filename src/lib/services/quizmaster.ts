import { Note } from "../models/note";
import { SectioningStrategy } from "../models/sectioning-strategy";
import { MultipleChoiceQuestion } from "../models/quiz-question";
import { OpenAIClient } from "./openai-client";
import { generateQuizRequestPrompt } from "./prompts";

export class Quizmaster {
  private openaiClient: OpenAIClient;

  constructor(model: string = "gpt-5-mini-2025-08-07", apiKey?: string) {
    this.openaiClient = new OpenAIClient(model, apiKey);
  }

  async createQuizList(
    note: Note,
    sectionStrategy: SectioningStrategy,
    quizPerSection: number
  ): Promise<MultipleChoiceQuestion[]> {
    // Section note to proper sections with given strategy
    const sectionList = sectionStrategy.process(note);

    const finalQuizList: MultipleChoiceQuestion[] = [];

    // Loop through sections to generate quiz
    // TODO: Make this faster with parallel requests
    for (const section of sectionList) {
      const requestPrompt = generateQuizRequestPrompt(
        section.content,
        quizPerSection
      );

      const generatedQuizText = await this.openaiClient.generateJson(
        requestPrompt
      );
      const jsonQuizList = JSON.parse(generatedQuizText).results;
      const quizList = MultipleChoiceQuestion.fromJsonList(jsonQuizList);
      finalQuizList.push(...quizList);
    }

    return finalQuizList;
  }
}
