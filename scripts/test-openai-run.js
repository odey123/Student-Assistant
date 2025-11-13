(async () => {
  const OpenAI = require('openai');
  require('dotenv').config();

  const assistantId = process.env.UNIBEN_ASSISTANT_ID || process.env.OPENAI_ASSISTANT_ID;
  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY');
    process.exit(1);
  }
  if (!assistantId) {
    console.error('Missing assistant id for test');
    process.exit(1);
  }

  console.log('Using assistant:', assistantId);
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const thread = await client.beta.threads.create();
    console.log('Created thread:', thread.id);

    await client.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: 'Test message: How do I register for courses?'
    });
    console.log('Added message');

    const run = await client.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId
    });
    console.log('Created run:', run.id);

    while (true) {
      const current = await client.beta.threads.runs.retrieve(thread.id, run.id);
      console.log('Run status:', current.status);
      if (current.status === 'completed') break;
      if (['failed', 'cancelled', 'expired'].includes(current.status)) {
        console.error('Run ended with status', current.status, current.last_error);
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const messages = await client.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data.find((m) => m.role === 'assistant');
    console.log('Assistant reply:', JSON.stringify(lastMessage, null, 2));
  } catch (err) {
    console.error('OpenAI error:', err);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    }
    process.exit(1);
  }
})();
