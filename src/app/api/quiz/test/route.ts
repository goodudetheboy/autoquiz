import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    const { api_key, model } = await request.json();

    if (!api_key) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    // Test the API key with a minimal completion request
    const openai = new OpenAI({
      apiKey: api_key,
    });

    try {
      // Make a minimal test request
      await openai.chat.completions.create({
        model: model || "gpt-5-mini-2025-08-07",
        messages: [
          {
            role: "user",
            content: "Hi",
          },
        ],
        max_completion_tokens: 5,
      });

      return NextResponse.json({ success: true });
    } catch (error: any) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key" },
          { status: 401 }
        );
      }
      if (error.status === 404) {
        return NextResponse.json(
          { error: "Invalid model name or model not accessible with this API key" },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error("API test error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to test API key" },
      { status: 500 }
    );
  }
}
