import OpenAI from "openai";

/**
 * Class to provide interface with various interactions with LLM
 */
export class OpenAIClient {
  private model: string;
  private client: OpenAI;

  constructor(model: string = "gpt-5-mini-2025-08-07", apiKey?: string) {
    this.model = model;
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  async generateText(prompt: string): Promise<string> {
    const chatCompletion = await this.client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: this.model,
    });

    return chatCompletion.choices[0].message.content || "";
  }

  async generateJson(prompt: string): Promise<string> {
    const chatCompletion = await this.client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: this.model,
      response_format: {
        type: "json_object",
      },
    });

    return chatCompletion.choices[0].message.content || "{}";
  }
}
