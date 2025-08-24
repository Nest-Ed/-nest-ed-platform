'use client'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Mic, Settings } from 'lucide-react'

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
    <div className="min-h-screen flex flex-col items-center justify-between bg-white">
      {/* Top section (logo + title) */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {messages.length === 0 && (
          <>
            <img
              src="/logo.png"
              alt="Nest-Ed Logo"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-semibold text-gray-800">Nest-Ed</h1>
            <p className="text-sm text-gray-500 mb-8">
              By Preet Kaur — a safe space to think. Supports ideas with ethical, scaffolded help — not answers.
            </p>

            {/* Suggested Prompts */}
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(p)}
                  className="px-4 py-3 rounded-xl border shadow-sm hover:bg-gray-50 text-sm text-gray-700 transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Chat Window */}
        {messages.length > 0 && (
          <div className="w-full max-w-2xl space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-blue-50 text-left border border-blue-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 italic">Nest-Ed is thinking...</div>
            )}
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="w-full max-w-2xl flex items-center px-4 pb-6">
        <div className="flex items-center w-full bg-white border rounded-full shadow px-4 py-2">
          <button className="text-gray-400 mr-2">+</button>
          <textarea
            rows="1"
            className="flex-1 outline-none resize-none text-sm px-1"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="ml-2 text-gray-500 hover:text-gray-700">
            <Mic size={18} />
          </button>
          <button className="ml-2 text-gray-500 hover:text-gray-700">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
