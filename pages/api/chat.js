export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4', // or use "gpt-3.5-turbo" if preferred
        messages: [
          {
            role: 'system',
            content: `You are Nest-Ed, a friendly, student-focused assistant. 
Always scaffold answers using markdown format: headers (##), bullet points, vocabulary boxes, and question prompts. 
Avoid direct full answers. Instead, guide the student through structured thinking. 
Use a calm, supportive tone. Refuse to complete work or write final answers. 
Always scaffold learning in steps, such as outlines, planning templates, or topic trees.`
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ response: data.choices[0].message.content });
    } else {
      console.error('OpenAI error:', data);
      res.status(500).json({ error: 'Failed to generate response' });
    }

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
