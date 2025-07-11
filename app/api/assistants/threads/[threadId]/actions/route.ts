import { openai } from "@/app/openai";

export async function POST(request, { params: { threadId } }) {
  const { toolCallOutputs, runId } = await request.json();

  const run = await openai.beta.threads.runs.submitToolOutputs(runId, {
    thread_id: threadId,
    tool_outputs: toolCallOutputs, // e.g. [{ tool_call_id, output }]
  });

  return Response.json(run);
}