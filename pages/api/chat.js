// pages/api/chat.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request format" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // production-safe model
        messages: [
          {
            role: "system",
            content: `
You are **Nest-Ed**, a student-centered thinking space built by Preet Kaur.

Your purpose:
- Scaffold learning (never give final answers).
- Encourage curiosity, critical thinking, and independence.
- Detect the student's input language and always respond in the same language.
- Be warm, supportive, and clear — never robotic.

Core Rules:
- Do not give full essays or direct solutions.
- Provide scaffolds (outlines, prompts, topic trees, diagrams, vocab support).
- Support multilingual learners automatically.
- If there's an error, respond kindly with a retry suggestion.
            `,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OpenAI API error:", data);
      return res.status(500).json({
        reply:
          "⚠️ Sorry, something went wrong on my end. Please try again in a moment.",
      });
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "⚠️ I couldn’t generate a response. Please try again.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({
      reply:
        "⚠️ Oops, I had a problem connecting. Please try again in a few seconds.",
    });
  }
}
