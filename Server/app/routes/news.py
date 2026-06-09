from fastapi import APIRouter
import requests
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# News cache — refreshes every 15 minutes
news_cache = {"data": None, "time": None}

def clean_text(text: str) -> str:
    """Remove messy characters from text."""
    if not text:
        return ""
    return text.replace("\xa0", " ").replace("\n", " ").strip()

@router.get("/news")
async def get_news():
    # Return cached news if less than 15 minutes old
    if news_cache["data"] and news_cache["time"]:
        age = datetime.now() - news_cache["time"]
        if age < timedelta(minutes=15):
            return news_cache["data"]

    try:
        api_key = os.getenv("FINNHUB_KEY")

        if not api_key:
            return {
                "articles": [],
                "total":    0,
                "error":    "FINNHUB_KEY not found in .env"
            }

        url = (f"https://finnhub.io/api/v1/news"
               f"?category=general&token={api_key}")
        response = requests.get(url, timeout=10)
        raw = response.json()

        if not isinstance(raw, list):
            return {
                "articles": [],
                "total":    0,
                "error":    f"Finnhub error: {raw}"
            }

        articles = []
        for item in raw[:10]:
            headline = clean_text(item.get("headline", ""))
            summary  = clean_text(item.get("summary",  ""))

            if not headline:
                continue

            timestamp = item.get("datetime", 0)
            try:
                date_str = datetime.fromtimestamp(
                    timestamp).strftime("%d %b %Y, %I:%M %p")
            except:
                date_str = ""

            articles.append({
                "id":        item.get("id"),
                "title":     headline,
                "summary":   summary,
                "source":    item.get("source", ""),
                "url":       item.get("url", ""),
                "image":     item.get("image", ""),
                "time":      date_str,
                "category":  item.get("category", "business"),
                "sentiment": "Neutral"
            })

        result = {
            "articles": articles,
            "total":    len(articles),
            "error":    None
        }

        # Save to cache
        news_cache["data"] = result
        news_cache["time"] = datetime.now()

        return result

    except Exception as e:
        return {
            "articles": [],
            "total":    0,
            "error":    f"Could not fetch news: {str(e)}"
        }