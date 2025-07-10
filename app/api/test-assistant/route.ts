// app/api/test-assistant/route.ts
import { openai } from "@/app/openai";
import { assistantId } from "@/app/assistant-config";

export async function GET() {
  try {
    const assistant = await openai.beta.assistants.retrieve(assistantId);
    return Response.json({ 
      success: true,
      assistantId: assistant.id,
      name: assistant.name,
      model: assistant.model
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    });
  }
}