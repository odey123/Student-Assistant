(async function(){
  try {
    require('dotenv').config();
  } catch(e){}
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) { console.error('OPENAI_API_KEY missing'); process.exit(2); }

  let fetchFn = (typeof fetch !== 'undefined') ? fetch : null;
  if (!fetchFn) {
    try { fetchFn = (await import('node-fetch')).default; } catch(e) { }
  }
  if (!fetchFn) { console.error('No fetch available. Install node-fetch or run on Node 18+'); process.exit(2); }

  console.log('Listing assistants for current project...');
  const res = await fetchFn('https://api.openai.com/v1/assistants', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    }
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch (e) { }
  console.log('Status:', res.status);
  if (json) console.log(JSON.stringify(json, null, 2));
  else console.log(text.slice(0, 2000));
})();
