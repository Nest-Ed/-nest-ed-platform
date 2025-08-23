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

    if (OPENAI_API_KEY) {
      // 🔹 Use OpenAI
      endpoint = "https://api.openai.com/v1/chat/completions";
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      };
      payload = {
        model: "gpt-4o", // You can change this to gpt-3.5-turbo or others
        messages,
        temperature: 0.2,
      };
    } else if (OPENROUTER_API_KEY) {
      // 🔹 Use OpenRouter
      endpoint = "https://openrouter.ai/api/v1/chat/completions";
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      };
      payload = {
        model: "openai/gpt-4o", // Or qwen/qwen3-72b-instruct if desired
        messages,
        temperature: 0.2,
      };
    } else {
      return res.status(500).json({
        error: "No API key found. Set OPENAI_API_KEY or OPENROUTER_API_KEY in Vercel → Project → Settings → Environment Variables.",
      });
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Provider error: ${errorText}` });
    }

    const data = await response.json();

    // 🔄 Normalize response text for both providers
    const content =
      data.choices?.[0]?.message?.content ??
      data.choices?.[0]?.delta?.content ??
      "";

    return res.status(200).json({ reply: content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
