import { useState } from "react";
import { useNavigate } from "react-router";

interface Topic {
  id: number;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  progress: number;
  locked: boolean;
  icon: string;
  prompt: string;
}

const topics: Topic[] = [
  {
    id: 1,
    title: "Stock Market Basics",
    description: "Understand how stock markets work, NSE, BSE, and how stocks are traded.",
    level: "Beginner",
    duration: "15 min",
    progress: 100,
    locked: false,
    icon: "📈",
    prompt: "Teach me stock market basics — how NSE and BSE work, what stocks are, and how trading happens. Keep it simple.",
  },
  {
    id: 2,
    title: "Fundamental Analysis",
    description: "Learn P/E ratio, EPS, Revenue, Profit margins and how to read financial statements.",
    level: "Beginner",
    duration: "20 min",
    progress: 60,
    locked: false,
    icon: "📊",
    prompt: "Teach me fundamental analysis — P/E ratio, EPS, Revenue, Profit margins. Give real Indian stock examples.",
  },
  {
    id: 3,
    title: "Technical Analysis",
    description: "Master candlestick charts, support/resistance, and chart patterns.",
    level: "Intermediate",
    duration: "25 min",
    progress: 20,
    locked: false,
    icon: "🕯️",
    prompt: "Teach me technical analysis — candlestick charts, support resistance levels, and common chart patterns with examples.",
  },
  {
    id: 4,
    title: "Trading Indicators",
    description: "RSI, MACD, Moving Averages, Bollinger Bands and VWAP explained.",
    level: "Intermediate",
    duration: "30 min",
    progress: 0,
    locked: false,
    icon: "📉",
    prompt: "Explain trading indicators — RSI, MACD, Moving Averages, Bollinger Bands and VWAP. When to use each one?",
  },
  {
    id: 5,
    title: "Portfolio & Risk Management",
    description: "Diversification, Sharpe ratio, Beta, and how to manage investment risk.",
    level: "Intermediate",
    duration: "25 min",
    progress: 0,
    locked: false,
    icon: "🛡️",
    prompt: "Teach me portfolio and risk management — diversification, Sharpe ratio, Beta, and how to reduce investment risk.",
  },
  {
    id: 6,
    title: "Mutual Funds & SIP",
    description: "Types of mutual funds, how SIP works, and how to choose the right fund.",
    level: "Beginner",
    duration: "20 min",
    progress: 0,
    locked: false,
    icon: "💼",
    prompt: "Explain mutual funds and SIP investing — types of funds, how SIP works, and how to choose funds for long term wealth.",
  },
  {
    id: 7,
    title: "Options & Derivatives",
    description: "Calls, puts, Greeks, and basic options trading strategies.",
    level: "Advanced",
    duration: "40 min",
    progress: 0,
    locked: true,
    icon: "🔐",
    prompt: "Teach me options and derivatives — calls, puts, option Greeks, and simple strategies like covered call and protective put.",
  },
  {
    id: 8,
    title: "IPO & New Listings",
    description: "How IPOs work, how to apply, GMP, and how to evaluate new listings.",
    level: "Intermediate",
    duration: "20 min",
    progress: 0,
    locked: true,
    icon: "🚀",
    prompt: "Explain how IPOs work in India — the process, how to apply via UPI, what GMP means, and how to evaluate if an IPO is worth investing.",
  },
];

export default function Learn() {
  const navigate    = useNavigate();
  const [filter, setFilter] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");

  const filtered = topics.filter(
    (t) => filter === "All" || t.level === filter
  );

  const totalTopics    = topics.length;
  const completedCount = topics.filter((t) => t.progress === 100).length;
  const inProgress     = topics.filter(
    (t) => t.progress > 0 && t.progress < 100
  ).length;
  const overallProgress = Math.round(
    topics.reduce((sum, t) => sum + t.progress, 0) / totalTopics
  );

  const startLesson = (topic: Topic) => {
    if (topic.locked) return;
    navigate(`/chat?q=${encodeURIComponent(topic.prompt)}`);
  };

  const levelColor = (level: string) => {
    if (level === "Beginner")     return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (level === "Intermediate") return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  };

  const progressColor = (p: number) => {
    if (p === 100) return "bg-green-500";
    if (p > 0)     return "bg-blue-500";
    return "bg-gray-200 dark:bg-gray-700";
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Learning Roadmap
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          AI-powered finance curriculum · Click any topic to start learning
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Topics",  value: totalTopics,       color: "text-gray-800 dark:text-white" },
          { label: "Completed",     value: completedCount,    color: "text-green-600" },
          { label: "In Progress",   value: inProgress,        color: "text-blue-600" },
          { label: "Overall Progress", value: `${overallProgress}%`, color: "text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl
            border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Overall Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border
        border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Your Progress
          </span>
          <span className="text-blue-600 font-semibold">{overallProgress}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full
          overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["All", "Beginner", "Intermediate", "Advanced"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium
              transition ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Topic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((topic) => (
          <div
            key={topic.id}
            onClick={() => startLesson(topic)}
            className={`bg-white dark:bg-gray-800 rounded-xl border
              border-gray-200 dark:border-gray-700 p-5 transition
              ${topic.locked
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
              }`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{topic.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800
                    dark:text-white">
                    {topic.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full
                      font-medium ${levelColor(topic.level)}`}>
                      {topic.level}
                    </span>
                    <span className="text-xs text-gray-400">
                      ⏱ {topic.duration}
                    </span>
                  </div>
                </div>
              </div>
              {topic.locked ? (
                <span className="text-gray-400 text-lg">🔒</span>
              ) : topic.progress === 100 ? (
                <span className="text-green-500 text-lg">✅</span>
              ) : (
                <span className="text-blue-500 text-sm font-medium">
                  Start →
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 dark:text-gray-400
              leading-relaxed mb-3">
              {topic.description}
            </p>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700
              rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  progressColor(topic.progress)
                }`}
                style={{ width: `${topic.progress}%` }}
              />
            </div>
            {topic.progress > 0 && (
              <div className="text-xs text-gray-400 mt-1 text-right">
                {topic.progress}% complete
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}