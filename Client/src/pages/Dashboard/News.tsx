import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";

interface Article {
    id: number;
    title: string;
    summary: string;
    source: string;
    url: string;
    image: string;
    time: string;
    category: string;
    sentiment: string;
}

export default function News() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/news");
            if (res.data.error) {
                setError(res.data.error);
            } else {
                setArticles(res.data.articles);
            }
        } catch {
            setError("Could not connect to server.");
        } finally {
            setLoading(false);
        }
    };

    const sentimentColor = (s: string) => {
        if (s === "Positive") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        if (s === "Negative") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
    };

    const sentimentDot = (s: string) => {
        if (s === "Positive") return "bg-green-500";
        if (s === "Negative") return "bg-red-500";
        return "bg-gray-400";
    };

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Financial News
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Live headlines · AI sentiment analysis
                    </p>
                </div>
                <button
                    onClick={fetchNews}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm
            font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                >
                    {loading ? "Refreshing..." : "↻ Refresh"}
                </button>
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
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800
              rounded-xl animate-pulse" />
                    ))}
                </div>
            )}

            {/* News Cards */}
            {!loading && !error && (
                <div className="space-y-4">
                    {articles.map((article) => (
                        <a
                            key={article.id}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition group"
                        >
                            <div className="flex gap-4">
                                {/* Image */}
                                {article.image && (
                                    <img
                                        src={article.image}
                                        alt=""
                                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                                        onError={(e) =>
                                            ((e.target as HTMLImageElement).style.display = "none")
                                        }
                                    />
                                )}

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    {/* Meta row */}
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                            {article.source}
                                        </span>
                                        <span className="text-gray-300 dark:text-gray-600">•</span>
                                        <span className="text-xs text-gray-400">{article.time}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${sentimentColor(article.sentiment)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${sentimentDot(article.sentiment)}`} />
                                            {article.sentiment}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2">
                                        {article.title}
                                    </h3>

                                    {/* Summary */}
                                    {article.summary && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                            {article.summary}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && articles.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-3">📰</div>
                    <div className="text-sm">No news articles found</div>
                </div>
            )}
        </div>
    );
}