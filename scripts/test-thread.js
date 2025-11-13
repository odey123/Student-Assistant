(async () => {
  const fetchFn = (typeof fetch !== 'undefined') ? fetch : (await import('node-fetch')).default;
  const base = 'http://localhost:3001';
  try {
    console.log('Creating thread...');
    const tRes = await fetchFn(base + '/api/assistants/threads', { method: 'POST' });
    const tBody = await tRes.text();
    console.log('Thread create status:', tRes.status);
    let threadId;
    try { threadId = JSON.parse(tBody).threadId; } catch (e) { console.log('Failed to parse thread body:', tBody); process.exit(1); }
    console.log('Got threadId:', threadId);

    console.log('Sending message to thread (university=futo)');
    const msgReq = await fetchFn(base + `/api/assistants/threads/${threadId}/messages?university=futo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Hello from local test. How do I register for courses?' })
    });

    console.log('Messages endpoint status:', msgReq.status);
    const contentType = msgReq.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);

    // If it's JSON (error), print JSON
    if (contentType.includes('application/json')) {
      const json = await msgReq.json();
      console.log('JSON response:', JSON.stringify(json, null, 2));
      process.exit(0);
    }

    // Otherwise it's a stream (event stream). Read first chunk then exit.
    const reader = msgReq.body.getReader();
    let received = '';
    const start = Date.now();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = new TextDecoder().decode(value);
      received += text;
      if (received.length > 2000 || (Date.now() - start) > 8000) break;
    }
    console.log('First bytes:', received.slice(0, 2000));

    process.exit(0);
  } catch (err) {
    console.error('Request error:', err);
    process.exit(1);
  }
})();
