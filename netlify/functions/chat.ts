import { Handler } from "@netlify/functions";
import OpenAI from "openai";

export const handler: Handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: "OPENAI_API_KEY is missing",
    };
  }

  // Safely parse body
  let messages;

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: "Missing request body",
      };
    }

    const parsed = JSON.parse(event.body);
    messages = parsed.messages;

    if (!Array.isArray(messages)) {
      throw new Error("messages must be an array");
    }
  } catch (err) {
    console.error("Invalid JSON body:", err);
    return {
      statusCode: 400,
      body: "Invalid JSON body",
    };
  }

  try {
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.8,
      max_tokens: 800,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(completion),
    };
  } catch (error) {
    console.error("OpenAI error:", error);
    return {
      statusCode: 500,
      body: "Failed to generate response",
    };
  }
};
