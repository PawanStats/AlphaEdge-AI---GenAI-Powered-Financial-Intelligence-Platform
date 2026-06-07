import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../api/axiosInstance";
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from "recharts";

interface StockQuote {
  ticker: string;
  price: number;
  change: number;
  changePct: string;
}

interface NewsItem {
  id: number;
  title: string;
  source: string;
  time: string;
  sentiment: string;
}

export default function Home() {
  const navigate = useNavigate();

  const [watchlist, setWatchlist]   = useState<StockQuote[]>([]);
  const [news, setNews]             = useState<NewsItem[]>([]);
  const [chartData, setChartData]   = useState<{date:string;price:number}[]>([]);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [loadingNews, setLoadingNews]     = useState(true);

  const watchlistTickers = ["RELIANCE", "TCS", "INFY", "HDFCBANK"];

  // Fetch watchlist stocks
  useEffect(() => {
    const fetchStocks = async () => {
      setLoadingStocks(true);
      try {
        const results = await Promise.all(
          watchlistTickers.map((t) => api.get(`/stock/${t}`))
        );
        const quotes: StockQuote[] = results.map((r) => {
          const d = r.data;
          const change = d.price - d.prev_close;
          return {
            ticker:    d.ticker,
            price:     d.price,
            change:    parseFloat(change.toFixed(2)),
            changePct: ((change / d.prev_close) * 100).toFixed(2),
          };
        });
        setWatchlist(quotes);

        // Use RELIANCE history for the chart
        const relianceData = results[0].data;
        if (relianceData.history) {
          setChartData(relianceData.history.slice(-14));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingStocks(false);
      }
    };
    fetchStocks();
  }, []);

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
      try {
        const res = await api.get("/news");
        setNews(res.data.articles?.slice(0, 4) || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchNews();
  }, []);

  const sentimentColor = (s: string) => {
    if (s === "Positive") return "text-green-600 bg-green-50 dark:bg-green-900/20";
    if (s === "Negative") return "text-red-500 bg-red-50 dark:bg-red-900/20";
    return "text-gray-500 bg-gray-50 dark:bg-gray-700";
  };

  const metrics = [
    {
      label:   "AI Chatbot",
      value:   "Ask anything",
      icon:    "🤖",
      color:   "bg-blue-50 dark:bg-blue-900/20",
      path:    "/chat",
    },
    {
      label:   "Stock Analysis",
      value:   "Real-time NSE",
      icon:    "📈",
      color:   "bg-green-50 dark:bg-green-900/20",
      path:    "/stocks",
    },
    {
      label:   "Portfolio",
      value:   "Track P&L",
      icon:    "💼",
      color:   "bg-purple-50 dark:bg-purple-900/20",
      path:    "/portfolio",
    },
    {
      label:   "Calculators",
      value:   "SIP · EMI · CI",
      icon:    "🧮",
      color:   "bg-yellow-50 dark:bg-yellow-900/20",
      path:    "/calculators",
    },
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome to AlphaEdge AI 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your AI-powered financial intelligence platform
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            onClick={() => navigate(m.path)}
            className={`${m.color} rounded-xl p-4 cursor-pointer
              hover:scale-105 transition-transform border border-transparent
              hover:border-blue-200 dark:hover:border-blue-800`}
          >
            <div className="text-2xl mb-2">{m.icon}</div>
            <div className="text-sm font-semibold text-gray-800
              dark:text-white">{m.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        {/* Watchlist */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border
          border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700
              dark:text-gray-300">
              Watchlist
            </h2>
            <button
              onClick={() => navigate("/stocks")}
              className="text-xs text-blue-600 hover:underline"
            >
              View all →
            </button>
          </div>

          {loadingStocks ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700
                  rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {watchlist.map((s) => (
                <div
                  key={s.ticker}
                  onClick={() => navigate(`/stocks`)}
                  className="flex items-center justify-between p-2 rounded-lg
                    hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer
                    transition"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-800
                      dark:text-white">
                      {s.ticker}
                    </div>
                    <div className="text-xs text-gray-400">NSE</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-800
                      dark:text-white">
                      ₹{s.price}
                    </div>
                    <div className={`text-xs font-medium ${
                      s.change >= 0 ? "text-green-600" : "text-red-500"
                    }`}>
                      {s.change >= 0 ? "▲" : "▼"}
                      {Math.abs(s.change)} ({s.changePct}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border
          border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700
              dark:text-gray-300">
              RELIANCE — 14 Day Trend
            </h2>
          </div>
          {loadingStocks ? (
            <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg
              animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9 }}
                  tickFormatter={(d) => d.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 9 }}
                  domain={["auto", "auto"]}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  // Accept possible undefined/value types from Recharts' Formatter
                  formatter={(v: any) => (v !== undefined && v !== null ? [`₹${v}`, "Price"] : ["", "Price"])}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Latest News */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border
        border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700
            dark:text-gray-300">
            Latest Financial News
          </h2>
          <button
            onClick={() => navigate("/news")}
            className="text-xs text-blue-600 hover:underline"
          >
            View all →
          </button>
        </div>

        {loadingNews ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700
                rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {news.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 p-2
                  rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                  transition cursor-pointer"
                onClick={() => navigate("/news")}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-white
                    line-clamp-1 font-medium">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{item.source}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{item.time}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full
                  font-medium flex-shrink-0 ${sentimentColor(item.sentiment)}`}>
                  {item.sentiment}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}