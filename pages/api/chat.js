export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Missing 'messages' array" });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  try {
    let endpoint = "";
    let headers = {};
    let payload = {};

    const scaffoldSystemMessage = {
      role: "system",
      content: `You are Nest-Ed, a student-centered AI assistant. Never give direct answers.
Your role is to help students learn by:
- Scaffolding step-by-step thinking.
- Using outlines, visual prompts, or simplified examples.
- Encouraging critical thinking and independent problem solving.
- Modeling how to structure responses without finishing it for them.
- Avoiding full essays or final answers. Always show how to think, not what to think.
- Support all learners using a warm, calm, helpful tone.
Avoid giving direct summaries or solving full problems. Break it down instead.`,
    };

    const fullMessages = [scaffoldSystemMessage, ...messages];

    if (OPENAI_API_KEY) {
      endpoint = "https://api.openai.com/v1/chat/completions";
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      };
      payload = {
        model: "gpt-4o", // or gpt-4o-mini if you prefer
        messages: fullMessages,
        temperature: 0.2,
      };
    } else if (OPENROUTER_API_KEY) {
      endpoint = "https://openrouter.ai/api/v1/chat/completions";
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      };
      payload = {
        model: "openai/gpt-4o", // for OpenRouter users
        messages: fullMessages,
        temperature: 0.2,
      };
    } else {
      return res.status(500).json({
        error:
          "No API key found. Set OPENAI_API_KEY or OPENROUTER_API_KEY in Vercel → Project → Settings → Environment Variables.",
      });
    }

    const r = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({ error: `Provider error: ${text}` });
    }

    const data = await r.json();
    const content =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.delta?.content ??
      "";

    return res.status(200).json({ reply: content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
