// components/ChatBox.jsx
import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are Nest-Ed, a helpful learning assistant." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const next = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await r.json();

      if (!r.ok) {
        throw new Error(data?.error || "Error from API");
      }

      setMessages([...next, { role: "assistant", content: data.reply || "" }]);
    } catch (err) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "Sorry, I ran into an error. Check that your API key is set in Vercel.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <h1 style={{ marginBottom: 8 }}>Nest-Ed Chat</h1>
      <p style={{ marginTop: 0, color: "#666" }}>
        Ask me anything about your coursework!
      </p>

      <div style={styles.chat}>
        {messages
          .filter((m) => m.role !== "system")
          .map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.msg,
                background: m.role === "user" ? "#eef" : "#f7f7f7",
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <strong style={{ textTransform: "capitalize" }}>
                {m.role}:
              </strong>{" "}
              {m.content}
            </div>
          ))}
        {loading && <div style={styles.dot}>Thinking…</div>}
      </div>

      <form onSubmit={sendMessage} style={styles.row}>
        <input
          style={styles.input}
          value={input}
          placeholder="Type your question…"
          onChange={(e) => setInput(e.target.value)}
        />
        <button disabled={loading} style={styles.btn}>
          Send
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "40px auto",
    padding: 16,
  },
  chat: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 300,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    background: "white",
  },
  msg: {
    padding: "10px 12px",
    borderRadius: 8,
    maxWidth: "80%",
  },
  dot: { color: "#888", fontStyle: "italic", margin: "4px 0" },
  row: { marginTop: 12, display: "flex", gap: 8 },
  input: {
    flex: 1,
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 6,
    outline: "none",
  },
  btn: {
    padding: "10px 14px",
    borderRadius: 6,
    background: "#111827",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
