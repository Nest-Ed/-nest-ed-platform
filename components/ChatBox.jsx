'use client'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function Chatbox() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
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
    <div className="p-4 max-w-2xl mx-auto">
      <div className="space-y-4">
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

      <div className="mt-4 flex">
        <textarea
          rows="2"
          className="flex-1 border rounded-lg p-2 mr-2"
          placeholder="Ask Nest-Ed anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  )
}
