// pages/api/chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ✅ safe working model
        messages: [
          {
            role: "system",
            content: "You are **Nest-Ed**, a student-centered thinking coach. Always scaffold learning, never give final answers. Use outlines, prompts, topic trees, and diagrams. Be supportive, clear, and multilingual."
          },
          ...messages
        ],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({
        reply: data.choices[0].message?.content || data.choices[0].text,
      });
    } else {
      console.error("OpenAI error:", data);
      res.status(500).json({ error: "Failed to generate response", details: data });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
