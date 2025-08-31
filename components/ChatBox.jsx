import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 text-gray-800">
      {/* Logo + Header */}
      <div className="mt-12 text-center">
        <img
          src="/logo.png"
          alt="Nest-Ed Logo"
          className="w-16 h-16 mx-auto rounded-full shadow-md"
        />
        <h1 className="text-3xl font-bold mt-4">Nest-Ed</h1>
        <p className="text-gray-600 mt-2">
          By Preet Kaur — a safe space to think. Supports ideas with ethical,
          scaffolded help — not answers.
        </p>
      </div>

      {/* Example prompts */}
      <div className="flex flex-wrap gap-3 justify-center mt-8 max-w-3xl">
        {[
          "Can you help me make a topic tree for my essay?",
          "I’m stuck. Can you model a similar math problem?",
          "Give me some critical thinking questions about...",
          "Can you help me build a scaffold to answer this...",
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => setInput(prompt)}
            className="px-4 py-2 bg-white rounded-xl shadow hover:bg-gray-100 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex flex-col w-full max-w-2xl flex-grow mt-6 p-4 bg-white rounded-xl shadow-md">
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg max-w-xs ${
                msg.sender === "user"
                  ? "bg-blue-100 ml-auto"
                  : "bg-gray-200 mr-auto"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input box */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Nest-Ed anything..."
            className="flex-grow px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
