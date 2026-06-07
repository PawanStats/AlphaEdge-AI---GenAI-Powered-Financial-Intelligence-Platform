import { useState, useRef, useEffect } from "react";
import api from "../../api/axiosInstance";
import { useSearchParams } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm AlphaEdge AI, your personal financial assistant. Ask me anything about stocks, mutual funds, SIP, or investing!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setInput(q);
  }, [searchParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", { messages: updated });
      setMessages([
        ...updated,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: "Sorry, I could not connect to the server. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "What is a P/E ratio?",
    "Explain SIP vs lump sum",
    "What is Nifty 50?",
    "How to analyze a stock?",
  ];

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          AI Financial Chatbot
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Powered by Gemini AI · Ask anything about finance & investing
        </p>
      </div>

      {/* Quick Questions */}
      <div className="flex gap-2 flex-wrap mb-4">
        {quickQuestions.map((q) => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="text-xs px-3 py-1.5 rounded-full border border-blue-200
              bg-blue-50 text-blue-600 hover:bg-blue-100 dark:border-blue-800
              dark:bg-blue-900/20 dark:text-blue-400 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200
        dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center
                justify-center text-white text-xs font-bold mr-2 flex-shrink-0
                mt-1">
                AI
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-none"
                }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600
                flex items-center justify-center text-gray-700 dark:text-gray-200
                text-xs font-bold ml-2 flex-shrink-0 mt-1">
                You
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center
              justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
              AI
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200
              dark:border-gray-700 px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about stocks, SIP, mutual funds..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200
            dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800
            dark:text-white text-sm focus:outline-none focus:ring-2
            focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm
            font-medium hover:bg-blue-700 disabled:opacity-50
            disabled:cursor-not-allowed transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}