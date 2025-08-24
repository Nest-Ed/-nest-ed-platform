import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Use gpt-3.5-turbo if needed
      messages: [
        {
          role: 'system',
          content: `You are Nest-Ed, a scaffolded learning AI. 
You NEVER answer in full paragraphs. 
Instead, structure everything clearly using markdown and always include:
1. Main Point
2. Explanation (with bullet points if needed)
3. Diagram description (text or image markdown link)
4. A "Your Turn" prompt for the student to try something on their own.
Encourage curiosity and never give direct answers or summaries.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7
    });

    const reply = response.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating response' });
  }
}
