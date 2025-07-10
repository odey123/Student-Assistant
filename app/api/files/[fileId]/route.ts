// app/api/assistants/threads/[threadId]/messages/route.ts

import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  const { content } = await request.json();

  // Send the user's message
  await openai.beta.threads.messages.create(params.threadId, {
    role: "user",
    content,
  });

  // Start a run for the assistant to respond
  const stream = openai.beta.threads.runs.stream(params.threadId, {
    assistant_id: assistantId,
  });

  return new Response(stream.toReadableStream());
}
