import { useState } from "react";
import api from "../../api/axiosInstance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface StockData {
  ticker: string;
  symbol: string;
  name: string;
  price: number;
  prev_close: number;
  pe_ratio: number;
  eps: number;
  market_cap: number;
  week_52_high: number;
  week_52_low: number;
  volume: number;
  sector: string;
  history: { date: string; price: number }[];
  ai_analysis: string;
  error: string | null;
}

export default function StockAnalysis() {
  const [ticker, setTicker]       = useState("");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const analyze = async () => {
    if (!ticker.trim()) return;
    setLoading(true);
    setError("");
    setStockData(null);

    try {
      const res = await api.get(`/stock/${ticker.toUpperCase()}`);
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setStockData(res.data);
      }
    } catch {
      setError("Could not connect to server. Make sure server is running.");
    } finally {
      setLoading(false);
    }
  };

  const formatMarketCap = (val: number) => {
    if (!val) return "N/A";
    if (val >= 1e12) return `₹${(val / 1e12).toFixed(2)}L Cr`;
    if (val >= 1e7)  return `₹${(val / 1e7).toFixed(2)} Cr`;
    return `₹${val}`;
  };

  const priceChange = stockData
    ? stockData.price - stockData.prev_close
    : 0;
  const priceChangePct = stockData
    ? ((priceChange / stockData.prev_close) * 100).toFixed(2)
    : "0";
  const isPositive = priceChange >= 0;

  const popularStocks = [
    "RELIANCE", "TCS", "INFY", "HDFCBANK",
    "WIPRO", "BAJFINANCE", "SBIN", "ADANIENT"
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Stock Analysis
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Real-time NSE/BSE data · AI-powered insights
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && analyze()}
          placeholder="Enter ticker e.g. RELIANCE, TCS, INFY..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200
            dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800
            dark:text-white text-sm focus:outline-none focus:ring-2
            focus:ring-blue-500"
        />
        <button
          onClick={analyze}
          disabled={loading || !ticker.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm
            font-medium hover:bg-blue-700 disabled:opacity-50
            disabled:cursor-not-allowed transition"
        >
          {loading ? "Loading..." : "Analyze"}
        </button>
      </div>

      {/* Popular Stocks */}
      <div className="flex gap-2 flex-wrap mb-6">
        {popularStocks.map((s) => (
          <button
            key={s}
            onClick={() => { setTicker(s); }}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-200
              dark:border-gray-700 text-gray-600 dark:text-gray-400
              hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600
              dark:hover:bg-blue-900/20 transition"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200
          dark:border-red-800 rounded-xl p-4 mb-4 text-sm text-red-600
          dark:text-red-400">
          ❌ {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800
              rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Stock Data */}
      {stockData && (
        <>
          {/* Company Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border
            border-gray-200 dark:border-gray-700 p-5 mb-4">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-0.5 bg-blue-100
                    dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
                    rounded-full">
                    {stockData.symbol}
                  </span>
                  <span className="text-xs text-gray-400">
                    {stockData.sector}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {stockData.name}
                </h2>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 dark:text-white">
                  ₹{stockData.price?.toFixed(2)}
                </div>
                <div className={`text-sm font-medium ${
                  isPositive ? "text-green-600" : "text-red-500"
                }`}>
                  {isPositive ? "▲" : "▼"} ₹{Math.abs(priceChange).toFixed(2)}
                  ({isPositive ? "+" : ""}{priceChangePct}%)
                </div>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[
              { label: "P/E Ratio",    value: stockData.pe_ratio?.toFixed(2) ?? "N/A" },
              { label: "EPS",          value: stockData.eps ? `₹${stockData.eps.toFixed(2)}` : "N/A" },
              { label: "Market Cap",   value: formatMarketCap(stockData.market_cap) },
              { label: "Volume",       value: stockData.volume?.toLocaleString("en-IN") ?? "N/A" },
              { label: "52W High",     value: `₹${stockData.week_52_high?.toFixed(2) ?? "N/A"}` },
              { label: "52W Low",      value: `₹${stockData.week_52_low?.toFixed(2) ?? "N/A"}` },
              { label: "Prev Close",   value: `₹${stockData.prev_close?.toFixed(2) ?? "N/A"}` },
              { label: "Sector",       value: stockData.sector ?? "N/A" },
            ].map((m) => (
              <div key={m.label} className="bg-white dark:bg-gray-800 rounded-xl
                border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-xs text-gray-400 mb-1">{m.label}</div>
                <div className="text-base font-semibold text-gray-800
                  dark:text-white">{m.value}</div>
              </div>
            ))}
          </div>

          {/* Price Chart */}
          {stockData.history?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border
              border-gray-200 dark:border-gray-700 p-5 mb-4">
              <h3 className="text-sm font-semibold text-gray-700
                dark:text-gray-300 mb-4">
                Price History — Last 30 Days
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={stockData.history}>
                  <CartesianGrid strokeDasharray="3 3"
                    stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(d) => d.slice(5)}
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    domain={["auto", "auto"]}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    formatter={(v) => [`₹${v ?? 0}`, "Price"]}
                    labelFormatter={(l) => `Date: ${l}`}
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
            </div>
          )}

          {/* AI Analysis */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border
            border-blue-200 dark:border-blue-800 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center
                justify-center text-white text-xs font-bold">
                AI
              </div>
              <h3 className="text-sm font-semibold text-blue-800
                dark:text-blue-300">
                AI Investment Insight
              </h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300
              leading-relaxed">
              {stockData.ai_analysis}
            </p>
          </div>
        </>
      )}
    </div>
  );
}