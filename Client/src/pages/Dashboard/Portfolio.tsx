import { useState } from "react";
import api from "../../api/axiosInstance";

interface Holding {
  ticker: string;
  quantity: number;
  buy_price: number;
}

interface HoldingResult {
  ticker: string;
  quantity: number;
  buy_price: number;
  current_price: number;
  invested: number;
  current_value: number;
  gain_loss: number;
  gain_pct: number;
}

interface PortfolioResult {
  holdings: HoldingResult[];
  total_invested: number;
  total_current: number;
  total_gain: number;
  total_gain_pct: number;
  ai_suggestion: string;
}

export default function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([
    { ticker: "", quantity: 0, buy_price: 0 },
  ]);
  const [result, setResult]   = useState<PortfolioResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const addRow = () =>
    setHoldings([...holdings, { ticker: "", quantity: 0, buy_price: 0 }]);

  const removeRow = (i: number) =>
    setHoldings(holdings.filter((_, idx) => idx !== i));

  const updateRow = (i: number, field: keyof Holding, value: string) => {
    const updated = [...holdings];
    updated[i] = {
      ...updated[i],
      [field]: field === "ticker" ? value.toUpperCase() : parseFloat(value) || 0,
    };
    setHoldings(updated);
  };

  const analyze = async () => {
    const valid = holdings.filter(
      (h) => h.ticker && h.quantity > 0 && h.buy_price > 0
    );
    if (valid.length === 0) {
      setError("Please add at least one holding with all fields filled.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.post("/portfolio/analyze", { holdings: valid });
      setResult(res.data);
    } catch {
      setError("Could not connect to server. Make sure server is running.");
    } finally {
      setLoading(false);
    }
  };

  const isPositive = (val: number) => val >= 0;

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Portfolio Analyzer
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your holdings · Get real-time P&L and risk analysis
        </p>
      </div>

      {/* Holdings Input Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border
        border-gray-200 dark:border-gray-700 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300
          mb-4">
          Your Holdings
        </h2>

        {/* Table Header */}
        <div className="grid grid-cols-4 gap-3 mb-2 px-1">
          {["Ticker", "Quantity", "Buy Price (₹)", ""].map((h) => (
            <div key={h} className="text-xs font-medium text-gray-400
              uppercase tracking-wide">
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {holdings.map((h, i) => (
          <div key={i} className="grid grid-cols-4 gap-3 mb-2">
            <input
              type="text"
              placeholder="e.g. TCS"
              value={h.ticker}
              onChange={(e) => updateRow(i, "ticker", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200
                dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm
                text-gray-800 dark:text-white focus:outline-none
                focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Qty"
              value={h.quantity || ""}
              onChange={(e) => updateRow(i, "quantity", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200
                dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm
                text-gray-800 dark:text-white focus:outline-none
                focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Buy price"
              value={h.buy_price || ""}
              onChange={(e) => updateRow(i, "buy_price", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200
                dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm
                text-gray-800 dark:text-white focus:outline-none
                focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => removeRow(i)}
              disabled={holdings.length === 1}
              className="text-red-400 hover:text-red-600 disabled:opacity-30
                text-lg font-bold transition"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Add Row + Analyze */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={addRow}
            className="px-4 py-2 rounded-lg border border-blue-300
              text-blue-600 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20
              transition"
          >
            + Add Stock
          </button>
          <button
            onClick={analyze}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm
              font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Analyzing..." : "Analyze Portfolio"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200
          dark:border-red-800 rounded-xl p-4 mb-4 text-sm text-red-600
          dark:text-red-400">
          ❌ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[
              {
                label: "Total Invested",
                value: `₹${result.total_invested.toLocaleString("en-IN")}`,
                color: "text-gray-800 dark:text-white",
              },
              {
                label: "Current Value",
                value: `₹${result.total_current.toLocaleString("en-IN")}`,
                color: "text-gray-800 dark:text-white",
              },
              {
                label: "Total Gain/Loss",
                value: `${isPositive(result.total_gain) ? "+" : ""}₹${result.total_gain.toLocaleString("en-IN")}`,
                color: isPositive(result.total_gain)
                  ? "text-green-600"
                  : "text-red-500",
              },
              {
                label: "Return %",
                value: `${isPositive(result.total_gain_pct) ? "+" : ""}${result.total_gain_pct}%`,
                color: isPositive(result.total_gain_pct)
                  ? "text-green-600"
                  : "text-red-500",
              },
            ].map((m) => (
              <div
                key={m.label}
                className="bg-white dark:bg-gray-800 rounded-xl border
                  border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="text-xs text-gray-400 mb-1">{m.label}</div>
                <div className={`text-lg font-bold ${m.color}`}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Holdings Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border
            border-gray-200 dark:border-gray-700 p-5 mb-4 overflow-x-auto">
            <h2 className="text-sm font-semibold text-gray-700
              dark:text-gray-300 mb-4">
              Holdings Breakdown
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase border-b
                  border-gray-100 dark:border-gray-700">
                  {["Stock", "Qty", "Buy Price", "Current",
                    "Invested", "Value", "Gain/Loss", "Return"].map((h) => (
                    <th key={h} className="text-left py-2 pr-4 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.holdings.map((h) => (
                  <tr
                    key={h.ticker}
                    className="border-b border-gray-50 dark:border-gray-700/50
                      hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                  >
                    <td className="py-3 pr-4 font-semibold text-gray-800
                      dark:text-white">
                      {h.ticker}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">
                      {h.quantity}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">
                      ₹{h.buy_price}
                    </td>
                    <td className="py-3 pr-4 text-gray-800 dark:text-white">
                      ₹{h.current_price}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">
                      ₹{h.invested.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 pr-4 text-gray-800 dark:text-white">
                      ₹{h.current_value.toLocaleString("en-IN")}
                    </td>
                    <td className={`py-3 pr-4 font-medium ${
                      isPositive(h.gain_loss)
                        ? "text-green-600"
                        : "text-red-500"
                    }`}>
                      {isPositive(h.gain_loss) ? "+" : ""}
                      ₹{h.gain_loss.toLocaleString("en-IN")}
                    </td>
                    <td className={`py-3 pr-4 font-medium ${
                      isPositive(h.gain_pct)
                        ? "text-green-600"
                        : "text-red-500"
                    }`}>
                      {isPositive(h.gain_pct) ? "+" : ""}
                      {h.gain_pct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Suggestion */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border
            border-blue-200 dark:border-blue-800 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex
                items-center justify-center text-white text-xs font-bold">
                AI
              </div>
              <h3 className="text-sm font-semibold text-blue-800
                dark:text-blue-300">
                AI Rebalancing Suggestion
              </h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300
              leading-relaxed">
              {result.ai_suggestion}
            </p>
          </div>
        </>
      )}
    </div>
  );
}