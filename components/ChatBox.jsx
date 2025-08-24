'use client'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Mic } from 'lucide-react'  // mic icon

export default function Chatbox() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const suggestedPrompts = [
    "Can you help me make a topic tree for my essay?",
    "I’m stuck. Can you model a similar math problem?",
    "Give me some critical thinking questions about...",
    "Can you help me build a scaffold to answer this..."
  ]

  const sendMessage = async (customPrompt) => {
    const text = customPrompt || input
    if (!text.trim()) return

    const userMessage = { role: 'user', content: text }
    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      const data = await res.json()
      if (res.ok) {
        const aiReply = { role: 'assistant', content: data.reply }
        setMessages(prev => [...prev, aiReply])
      } else {
        console.error('API error:', data.error)
      }
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      {/* Logo + Title */}
      <div className="text-center mb-10">
        <img
          src="/logo.png" // <- add your Nest-Ed logo here (in /public folder)
          alt="Nest-Ed Logo"
          className="w-16 h-16 mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold">Nest-Ed</h1>
        <p className="text-gray-500">
          By Preet Kaur — a safe space to think. Supports ideas with ethical, scaffolded help — not answers.
        </p>
      </div>

      {/* Suggested Prompts */}
      {messages.length === 0 && (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 mb-8">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(p)}
              className="px-4 py-3 border rounded-xl shadow-sm hover:bg-gray-100 text-sm"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Chat Window */}
      <div className="w-full max-w-2xl space-y-4 px-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-100 text-left'
                : 'bg-gray-100'
            }`}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 italic">Nest-Ed is thinking...</div>
        )}
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-4 w-full max-w-2xl flex items-center px-4">
        <textarea
          rows="1"
          className="flex-1 border rounded-full px-4 py-2 mr-2 resize-none"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={() => sendMessage()}
          className="bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
        <button className="ml-2 p-2 rounded-full border hover:bg-gray-100">
          <Mic size={20} />
        </button>
      </div>
    </div>
  )
}
