"use client"
import { useState } from "react"
import ReactMarkdown from "react-markdown"

export default function ChatBox() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = { role: "user", content: input }
    setMessages([...messages, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })

      const data = await res.json()
      const aiReply = { role: "assistant", content: data.response }
      setMessages((prev) => [...prev, aiReply])
    } catch (err) {
      console.error("Error sending message:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 text-gray-800 px-4 py-6">
      
      {/* Header */}
      <div className="text-center mt-6">
        <img src="/logo.png" alt="Nest-Ed Logo" className="w-20 h-20 mx-auto mb-4 rounded-full shadow" />
        <h1 className="text-3xl font-bold">Nest-Ed</h1>
        <p className="text-gray-600 mt-2">
          By Preet Kaur — a safe space to think. Supports ideas with ethical, scaffolded help — not answers.
        </p>
      </div>

      {/* Suggestion Buttons */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          {[
            "Can you help me make a topic tree for my essay?",
            "I’m stuck. Can you model a similar math problem?",
            "Give me some critical thinking questions about...",
            "Can you help me build a scaffold to answer this...",
          ].map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => setInput(suggestion)}
              className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-100 transition text-sm text-gray-700"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 w-full max-w-2xl mt-6 space-y-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.role === "user"
                ? "bg-blue-100 self-end ml-auto text-right"
                : "bg-gray-100 self-start mr-auto text-left"
            }`}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}

        {loading && (
          <div className="italic text-gray-500 text-sm">Nest-Ed is thinking...</div>
        )}
      </div>

      {/* Input Bar */}
      <div className="w-full max-w-2xl flex items-center mt-6 mb-4">
        <textarea
          rows="2"
          className="flex-1 border rounded-lg p-2 mr-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask Nest-Ed anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}
