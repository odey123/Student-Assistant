// app/openai.ts
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY!;
console.log("OPENAI_API_KEY (first 5):", apiKey.slice(0, 5));

export const openai = new OpenAI({
  apiKey,
});
