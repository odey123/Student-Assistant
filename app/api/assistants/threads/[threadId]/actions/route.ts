import { openai } from "@/app/openai";

// Send a new message to a thread by submitting tool outputs
export async function POST(request, { params: { threadId } }) {
  try {
    const { toolCallOutputs, runId } = await request.json();

    // Validate incoming data (optional but recommended)
    if (!toolCallOutputs || !Array.isArray(toolCallOutputs) || !runId) {
      return new Response(JSON.stringify({ error: "Missing or invalid toolCallOutputs or runId" }), { status: 400 });
    }

    // Submit tool outputs to the thread run.
    // The 'tool_outputs' property is expected by the OpenAI API for this method.
    // If you are seeing a TypeScript error here, it likely means your
    // '@openai/openai' package's type definitions are outdated.
    // Please ensure you have the latest version of the OpenAI library installed.
    const stream = openai.beta.threads.runs.submitToolOutputsStream(
      threadId,
      runId,
      { tool_outputs: toolCallOutputs } // This structure is correct for the OpenAI API
    );

    // Return the stream as a readable response
    return new Response(stream.toReadableStream());
  } catch (error) {
    console.error("Error submitting tool outputs:", error);
    // Return a more informative error message to the client
    return new Response(JSON.stringify({ error: "Failed to submit tool outputs", details: error.message }), { status: 500 });
  }
}
