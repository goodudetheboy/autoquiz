import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Class to provide interface with various interactions with LLM
 */
export class OpenAIClient {
  private model: string;

  constructor(model: string = "gpt-4o") {
    this.model = model;
  }

  async generateText(prompt: string): Promise<string> {
    const chatCompletion = await client.chat.completions.create({
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
    const chatCompletion = await client.chat.completions.create({
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
