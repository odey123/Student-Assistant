// app/openai.ts
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Missing OPENAI_API_KEY environment variable. Set OPENAI_API_KEY in your environment (e.g., .env or Vercel project settings)."
  );
}

export const openai = new OpenAI({
  apiKey,
});
