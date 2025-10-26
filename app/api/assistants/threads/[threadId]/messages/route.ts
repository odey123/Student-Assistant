import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";
import { getUniversityById } from "@/app/config/universities";

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  const { content } = await request.json();

  // Get university from query parameter
  const { searchParams } = new URL(request.url);
  const universityId = searchParams.get('university') || 'unilag';

  // Get the university's assistant ID
  const university = getUniversityById(universityId);
  const selectedAssistantId = university?.assistantId || assistantId;

  if (!selectedAssistantId) {
    return new Response(
      JSON.stringify({
        error: `Assistant not configured for ${university?.name || universityId}. Please contact support.`
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  await openai.beta.threads.messages.create(params.threadId, {
    role: "user",
    content: content,
  });

  const stream = openai.beta.threads.runs.stream(params.threadId, {
    assistant_id: selectedAssistantId,
  });

  return new Response(stream.toReadableStream());
}
