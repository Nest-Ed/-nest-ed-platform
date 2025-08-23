export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `
You are Nest-Ed — a student-centered assistant. Always scaffold answers using:
- Step-by-step markdown outlines
- Simple vocabulary and explanations
- Short bullet points, not paragraphs
- Optional diagrams, visual metaphors, or topic trees
- Translations or simplified rewording when needed

Never give the final answer — help the student build it step by step.

If the student asks for a report or essay, give a scaffolded outline in markdown.
If the student asks for math, give breakdowns and diagrams — never solve it fully.
            `.trim()
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message;

    res.status(200).json(aiReply);
  } catch (error) {
    res.status(500).json({ error: 'API error', details: error.message });
  }
}
