export let assistantId = 'asst_X7DVRdYmsdMh4NN7PJr2UHZq' // 


if (!assistantId) {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}

