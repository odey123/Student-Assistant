require('dotenv').config();
const { default: OpenAI } = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

console.log('Top level properties:', Object.keys(client).filter(k => k[0] !== '_'));
console.log('\nBeta properties:', Object.keys(client.beta));

// Try to find vectorStores
if (client.vectorStores) {
  console.log('Found vectorStores at top level');
} else if (client.beta.vectorStores) {
  console.log('Found vectorStores in beta');
} else {
  console.log('vectorStores not found - checking alternative locations...');

  // List all methods and properties
  console.log('\nAll client methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(client)).filter(m => m !== 'constructor'));
}
