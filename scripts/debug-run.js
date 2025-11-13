import 'dotenv/config';
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  const assistantId = process.argv[2] || process.env.UNIZIK_ASSISTANT_ID;
  const question = process.argv.slice(3).join(" ") || "Hi, can you help with course registration?";

  if (!assistantId) {
    console.error("Assistant id is required. Pass as arg or set env value.");
    process.exit(1);
  }

  console.log("Using assistant:", assistantId);
  console.log("Question:", question);

  const thread = await client.beta.threads.create();
  const threadId = thread.id;
  console.log("Created thread:", threadId);

  await client.beta.threads.messages.create(threadId, {
    role: "user",
    content: question,
  });
  console.log("Message added.");

  const run = await client.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });
  const runId = run.id;
  console.log("Run created:", runId, "status:", run.status);

  let current = run;
  const terminalStates = new Set(["completed", "failed", "cancelled", "expired"]);

  while (!terminalStates.has(current.status)) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
  current = await client.beta.threads.runs.retrieve(runId, { thread_id: threadId });
    console.log("Polled status:", current.status);
  }

  console.log("Final status:", current.status);

  if (current.last_error) {
    console.log("last_error:", current.last_error);
  }

  if (current.required_action) {
    console.log("required_action:", JSON.stringify(current.required_action, null, 2));
  }

  if (current.status === "completed") {
  const messages = await client.beta.threads.messages.list(threadId, { limit: 10 });
    const latest = messages.data[0];
    const textParts = latest?.content?.filter((item) => item.type === "text");
    if (textParts?.length) {
      console.log("Assistant reply:\n", textParts.map((item) => item.text?.value || "").join("\n"));
    } else {
      console.log("No text content in latest message.");
    }
  }
}

main().catch((err) => {
  console.error("Debug run failed:", err);
  process.exit(1);
});
