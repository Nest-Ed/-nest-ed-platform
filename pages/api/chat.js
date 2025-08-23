export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'No message provided' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const endpoint = 'https://openrouter.ai/api/v1/chat/completions';

  const prompt = `
You are Nest-Ed, a student learning assistant who always replies in scaffolded form.
Do NOT give final answers. Instead, reply using the following structure:
- Title
- Scaffolded outline with step-by-step thinking
- Bullet points or questions to prompt the student
- Optional vocabulary support or visuals if helpful

Use this structure always. Be encouraging. Never write in full paragraphs unless explaining an idea clearly.

User's question: "${userMessage}"
  `;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Or change to 'openchat' or 'mistral' via OpenRouter
        messages: [
          {
            role: 'system',
            content: 'You are Nest-Ed, a helpful scaffolded learning assistant for students.',
          },
          {
            role: 'user',
            content: prompt,
          }
        ],
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: 'No response from model' });
    }

    const reply = data.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Error connecting to language model' });
  }
}
